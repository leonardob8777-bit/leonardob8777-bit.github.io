//
//  GuiaViewController.swift
//  LB — iOS Hub
//
//  La GUÍA como carrusel nativo: una tarjeta por paso, se desliza de
//  costado, con puntitos de progreso abajo. Los pasos NO están escritos
//  acá: se los manda el sitio (array SECCIONES) por el puente JS, así
//  hay una sola fuente de verdad y el carrusel se actualiza solo.
//

import UIKit

/// Un paso de la guía (tal como llega desde el sitio).
struct PasoGuia {
    let titulo: String
    let detalle: String   // puede traer <b>...</b>
}

final class GuiaViewController: UIViewController {

    /// La app llama esto cuando el usuario toca el botón final del
    /// carrusel, para saltar a otra pestaña (p. ej. "apps").
    var alPedirSeccion: ((String) -> Void)?

    private var pasos: [PasoGuia] = []
    private var tituloGuia = "Guide"
    private var subtitulo = ""
    private var paginaActual = 0
    private var anchoPrevio: CGFloat = 0

    private let encabezado = UILabel()
    private let bajada = UILabel()
    private let puntos = UIPageControl()

    private lazy var coleccion: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        layout.minimumInteritemSpacing = 0
        layout.sectionInset = .zero
        let cv = UICollectionView(frame: .zero, collectionViewLayout: layout)
        cv.isPagingEnabled = true
        cv.showsHorizontalScrollIndicator = false
        cv.backgroundColor = .clear
        cv.dataSource = self
        cv.delegate = self
        cv.register(GuiaCelda.self, forCellWithReuseIdentifier: GuiaCelda.id)
        cv.translatesAutoresizingMaskIntoConstraints = false
        return cv
    }()

    // MARK: - Ciclo de vida

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Config.colorFondo

        encabezado.font = .systemFont(ofSize: 22, weight: .bold)
        encabezado.textColor = .white
        encabezado.numberOfLines = 0
        encabezado.text = tituloGuia
        encabezado.translatesAutoresizingMaskIntoConstraints = false

        bajada.font = .systemFont(ofSize: 13)
        bajada.textColor = UIColor(white: 0.62, alpha: 1)
        bajada.numberOfLines = 0
        bajada.translatesAutoresizingMaskIntoConstraints = false

        puntos.currentPageIndicatorTintColor = Config.colorMarca
        puntos.pageIndicatorTintColor = UIColor(white: 0.3, alpha: 1)
        puntos.numberOfPages = pasos.count
        puntos.addTarget(self, action: #selector(tocarPuntos), for: .valueChanged)
        puntos.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(encabezado)
        view.addSubview(bajada)
        view.addSubview(coleccion)
        view.addSubview(puntos)

        let g = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            encabezado.topAnchor.constraint(equalTo: g.topAnchor, constant: 14),
            encabezado.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 22),
            encabezado.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -22),

            bajada.topAnchor.constraint(equalTo: encabezado.bottomAnchor, constant: 4),
            bajada.leadingAnchor.constraint(equalTo: encabezado.leadingAnchor),
            bajada.trailingAnchor.constraint(equalTo: encabezado.trailingAnchor),

            coleccion.topAnchor.constraint(equalTo: bajada.bottomAnchor, constant: 12),
            coleccion.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            coleccion.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            coleccion.bottomAnchor.constraint(equalTo: puntos.topAnchor, constant: -8),

            puntos.bottomAnchor.constraint(equalTo: g.bottomAnchor, constant: -10),
            puntos.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        ])
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // Si cambió el ancho (rotación), recalculamos el tamaño de tarjeta
        // y volvemos a la página en la que estábamos.
        if coleccion.bounds.width != anchoPrevio {
            anchoPrevio = coleccion.bounds.width
            coleccion.collectionViewLayout.invalidateLayout()
            DispatchQueue.main.async { [weak self] in self?.irAPagina(self?.paginaActual ?? 0, animado: false) }
        }
    }

    // MARK: - Datos (llegan del sitio)

    func cargar(titulo: String, descripcion: String, pasos: [PasoGuia]) {
        self.tituloGuia = titulo
        self.subtitulo = descripcion
        self.pasos = pasos

        guard isViewLoaded else { return }
        encabezado.text = titulo
        bajada.text = descripcion
        puntos.numberOfPages = pasos.count
        coleccion.reloadData()
    }

    // MARK: - Paginado

    @objc private func tocarPuntos() {
        irAPagina(puntos.currentPage, animado: true)
    }

    private func irAPagina(_ i: Int, animado: Bool) {
        guard i >= 0, i < pasos.count, coleccion.bounds.width > 0 else { return }
        let x = CGFloat(i) * coleccion.bounds.width
        coleccion.setContentOffset(CGPoint(x: x, y: 0), animated: animado)
        paginaActual = i
        puntos.currentPage = i
    }
}

// MARK: - Datos y layout de la colección

extension GuiaViewController: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {

    func collectionView(_ cv: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        pasos.count
    }

    func collectionView(_ cv: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let celda = cv.dequeueReusableCell(withReuseIdentifier: GuiaCelda.id, for: indexPath) as! GuiaCelda
        let esUltimo = indexPath.item == pasos.count - 1
        celda.configurar(indice: indexPath.item, total: pasos.count,
                         paso: pasos[indexPath.item], esUltimo: esUltimo)
        celda.alBotonFinal = { [weak self] in self?.alPedirSeccion?("apps") }
        return celda
    }

    func collectionView(_ cv: UICollectionView, layout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        CGSize(width: cv.bounds.width, height: cv.bounds.height)
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        guard scrollView.bounds.width > 0 else { return }
        let p = Int((scrollView.contentOffset.x / scrollView.bounds.width).rounded())
        if p != paginaActual, p >= 0, p < pasos.count {
            paginaActual = p
            puntos.currentPage = p
        }
    }
}

// MARK: - Tarjeta de un paso

final class GuiaCelda: UICollectionViewCell {

    static let id = "GuiaCelda"

    var alBotonFinal: (() -> Void)?

    private let tarjeta = UIView()
    private let scroll = UIScrollView()
    private let numero = UILabel()
    private let titulo = UILabel()
    private let detalle = UILabel()
    private let boton = UIButton(type: .system)

    override init(frame: CGRect) {
        super.init(frame: frame)
        armar()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) no usado") }

    private func armar() {
        tarjeta.backgroundColor = UIColor(red: 0.05, green: 0.09, blue: 0.07, alpha: 1)
        tarjeta.layer.cornerRadius = 22
        tarjeta.layer.borderWidth = 1
        tarjeta.layer.borderColor = Config.colorMarca.withAlphaComponent(0.28).cgColor
        tarjeta.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(tarjeta)

        numero.font = .systemFont(ofSize: 12, weight: .bold)
        numero.textColor = Config.colorMarca

        titulo.font = .systemFont(ofSize: 23, weight: .bold)
        titulo.textColor = .white
        titulo.numberOfLines = 0

        detalle.numberOfLines = 0

        boton.setTitleColor(.black, for: .normal)
        boton.titleLabel?.font = .systemFont(ofSize: 15, weight: .semibold)
        boton.backgroundColor = Config.colorMarca
        boton.layer.cornerRadius = 12
        boton.setTitle("Start — open the Apps tab", for: .normal)
        boton.contentEdgeInsets = UIEdgeInsets(top: 12, left: 18, bottom: 12, right: 18)
        boton.addTarget(self, action: #selector(tocarBoton), for: .touchUpInside)
        boton.isHidden = true

        let pila = UIStackView(arrangedSubviews: [numero, titulo, detalle, boton])
        pila.axis = .vertical
        pila.alignment = .leading
        pila.spacing = 12
        pila.setCustomSpacing(18, after: detalle)
        pila.translatesAutoresizingMaskIntoConstraints = false

        scroll.showsVerticalScrollIndicator = false
        scroll.translatesAutoresizingMaskIntoConstraints = false
        scroll.addSubview(pila)
        tarjeta.addSubview(scroll)

        NSLayoutConstraint.activate([
            tarjeta.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 4),
            tarjeta.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -4),
            tarjeta.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 18),
            tarjeta.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -18),

            scroll.topAnchor.constraint(equalTo: tarjeta.topAnchor, constant: 26),
            scroll.bottomAnchor.constraint(equalTo: tarjeta.bottomAnchor, constant: -26),
            scroll.leadingAnchor.constraint(equalTo: tarjeta.leadingAnchor, constant: 24),
            scroll.trailingAnchor.constraint(equalTo: tarjeta.trailingAnchor, constant: -24),

            pila.topAnchor.constraint(equalTo: scroll.topAnchor),
            pila.bottomAnchor.constraint(equalTo: scroll.bottomAnchor),
            pila.leadingAnchor.constraint(equalTo: scroll.leadingAnchor),
            pila.trailingAnchor.constraint(equalTo: scroll.trailingAnchor),
            pila.widthAnchor.constraint(equalTo: scroll.widthAnchor),
        ])
    }

    func configurar(indice: Int, total: Int, paso: PasoGuia, esUltimo: Bool) {
        numero.text = "STEP \(indice + 1) / \(total)"
        titulo.text = paso.titulo
        detalle.attributedText = GuiaCelda.atribuir(paso.detalle)
        boton.isHidden = !esUltimo
    }

    @objc private func tocarBoton() { alBotonFinal?() }

    // MARK: - HTML mínimo → texto con negritas

    /// Convierte un detalle con <b>...</b> en texto con partes en negrita.
    /// El sitio solo usa <b>; cualquier otra etiqueta se quita.
    static func atribuir(_ html: String) -> NSAttributedString {
        var s = html
        s = s.replacingOccurrences(of: "<b>", with: "\u{1}")
        s = s.replacingOccurrences(of: "</b>", with: "\u{2}")
        s = s.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
        s = s.replacingOccurrences(of: "&amp;", with: "&")
        s = s.replacingOccurrences(of: "&lt;", with: "<")
        s = s.replacingOccurrences(of: "&gt;", with: ">")
        s = s.replacingOccurrences(of: "&nbsp;", with: " ")

        let parrafo = NSMutableParagraphStyle()
        parrafo.lineSpacing = 4

        let normal: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 15),
            .foregroundColor: UIColor(white: 0.80, alpha: 1),
            .paragraphStyle: parrafo,
        ]
        let fuerte: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 15, weight: .semibold),
            .foregroundColor: UIColor.white,
            .paragraphStyle: parrafo,
        ]

        let salida = NSMutableAttributedString()
        var enNegrita = false
        for c in s {
            switch c {
            case "\u{1}": enNegrita = true
            case "\u{2}": enNegrita = false
            default:
                salida.append(NSAttributedString(string: String(c),
                                                 attributes: enNegrita ? fuerte : normal))
            }
        }
        return salida
    }
}
