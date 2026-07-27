//
//  WebViewController.swift
//  LB — iOS Hub
//
//  Pantalla principal: un WKWebView con el sitio + una BARRA DE PESTAÑAS
//  NATIVA abajo. La barra reemplaza al menú de categorías del sitio, así
//  la navegación se siente de app y no de página web.
//
//  ⚠️ LO MÁS IMPORTANTE DE ESTE ARCHIVO
//  iOS NO permite instalar perfiles (.mobileconfig) ni enlaces
//  `itms-services://` desde dentro de una app: solo funcionan en Safari.
//  Por eso esos se mandan AFUERA (UIApplication.open). En cambio, los
//  enlaces web comunes (KravaSign, MediaFire...) se abren en una hoja
//  deslizable DENTRO de la app (SFSafariViewController), que se siente
//  mucho más nativa que patear a Safari.
//

import UIKit
import WebKit
import SafariServices

final class WebViewController: UIViewController {

    private var webView: WKWebView!
    private let barra = UITabBar()
    private let barraFondo = UIView()
    private let guia = GuiaViewController()   // carrusel nativo de la guía
    private let refresco = UIRefreshControl()
    private lazy var vistaSinConexion = crearVistaSinConexion()
    private let cargando = UIActivityIndicatorView(style: .medium)

    /// Genera la vibración corta al tocar una pestaña.
    private let toque = UIImpactFeedbackGenerator(style: .light)

    // MARK: - Ciclo de vida

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Config.colorFondo

        configurarWebView()
        configurarBarra()
        configurarGuia()
        configurarCargando()
        cargarSitio()
    }

    /// Barra de estado en blanco (el sitio es oscuro).
    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    // MARK: - Armado del WebView

    private func configurarWebView() {
        let contenido = WKUserContentController()

        // 1) Canal por el que el sitio le avisa a la app qué sección
        //    está activa (para sincronizar la barra).
        contenido.add(self, name: ModoApp.canal)

        // 2) Inyectamos el CSS de "modo app" apenas empieza a cargar.
        let cssJS = "(function(){var s=document.createElement('style');"
            + "s.textContent=`\(ModoApp.css)`;"
            + "(document.head||document.documentElement).appendChild(s);})();"
        contenido.addUserScript(WKUserScript(
            source: cssJS, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        // 3) Y el puente JS cuando el DOM ya está armado.
        contenido.addUserScript(WKUserScript(
            source: ModoApp.js, injectionTime: .atDocumentEnd, forMainFrameOnly: true))

        let config = WKWebViewConfiguration()
        config.userContentController = contenido
        config.allowsInlineMediaPlayback = true
        config.defaultWebpagePreferences.allowsContentJavaScript = true
        // Deja una marca en el User-Agent para que el sitio sepa que
        // corre dentro de la app (además del `in-app` que inyectamos).
        config.applicationNameForUserAgent = Config.userAgentApp

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.isOpaque = false
        webView.backgroundColor = Config.colorFondo
        webView.scrollView.backgroundColor = Config.colorFondo
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // Deslizar hacia abajo recarga
        refresco.tintColor = Config.colorMarca
        refresco.addTarget(self, action: #selector(recargar), for: .valueChanged)
        webView.scrollView.refreshControl = refresco

        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
    }

    // MARK: - Barra de pestañas nativa

    private func configurarBarra() {
        // Fondo que tapa la zona del indicador de inicio con el color de
        // la marca, para que no quede una franja clara abajo.
        barraFondo.backgroundColor = Config.colorFondo
        barraFondo.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(barraFondo)

        barra.items = ModoApp.pestanas.enumerated().map { indice, p in
            let item = UITabBarItem(
                title: p.titulo,
                image: UIImage(systemName: p.simbolo),
                tag: indice)
            return item
        }
        barra.selectedItem = barra.items?.first
        barra.delegate = self
        barra.translatesAutoresizingMaskIntoConstraints = false
        aplicarEstiloBarra()
        view.addSubview(barra)

        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: barra.topAnchor),

            barra.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            barra.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            barra.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),

            barraFondo.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            barraFondo.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            barraFondo.topAnchor.constraint(equalTo: barra.topAnchor),
            barraFondo.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }

    private func aplicarEstiloBarra() {
        let gris = UIColor(white: 0.55, alpha: 1)
        barra.tintColor = Config.colorMarca
        barra.unselectedItemTintColor = gris
        barra.isTranslucent = false
        barra.barTintColor = Config.colorFondo

        if #available(iOS 15.0, *) {
            let ap = UITabBarAppearance()
            ap.configureWithOpaqueBackground()
            ap.backgroundColor = Config.colorFondo
            for estilo in [ap.stackedLayoutAppearance, ap.inlineLayoutAppearance, ap.compactInlineLayoutAppearance] {
                estilo.normal.iconColor = gris
                estilo.normal.titleTextAttributes = [.foregroundColor: gris]
                estilo.selected.iconColor = Config.colorMarca
                estilo.selected.titleTextAttributes = [.foregroundColor: Config.colorMarca]
            }
            barra.standardAppearance = ap
            barra.scrollEdgeAppearance = ap
        }
    }

    /// Deja seleccionada la pestaña que corresponde a una sección, SIN
    /// llamar al delegate (así no se dispara otro cambio en el sitio).
    private func seleccionarPestana(id: String) {
        guard let idx = ModoApp.pestanas.firstIndex(where: { $0.id == id }),
              let items = barra.items, idx < items.count else { return }
        if barra.selectedItem !== items[idx] {
            barra.selectedItem = items[idx]
        }
    }

    // MARK: - Guía nativa (carrusel)

    private func configurarGuia() {
        addChild(guia)
        guia.view.isHidden = true
        guia.view.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(guia.view)
        guia.didMove(toParent: self)

        // El botón final del carrusel salta a la pestaña Apps.
        guia.alPedirSeccion = { [weak self] id in
            self?.cambiarSeccion(id: id, hapticar: false)
        }

        NSLayoutConstraint.activate([
            guia.view.topAnchor.constraint(equalTo: view.topAnchor),
            guia.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            guia.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            guia.view.bottomAnchor.constraint(equalTo: barra.topAnchor),
        ])
    }

    /// Cambia de sección desde la barra. Si es "guide" muestra el
    /// carrusel nativo por encima del sitio; para el resto, oculta el
    /// carrusel y le pide al sitio que muestre esa sección.
    private func cambiarSeccion(id: String, hapticar: Bool) {
        if hapticar { toque.impactOccurred() }
        seleccionarPestana(id: id)

        let esGuia = (id == "guide")
        guia.view.isHidden = !esGuia
        if esGuia {
            view.bringSubviewToFront(guia.view)
        } else {
            webView.evaluateJavaScript("window.LBApp && LBApp.show('\(id)')", completionHandler: nil)
        }
    }

    // MARK: - Indicador de carga

    private func configurarCargando() {
        cargando.color = Config.colorMarca
        cargando.hidesWhenStopped = true
        cargando.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(cargando)
        NSLayoutConstraint.activate([
            cargando.centerXAnchor.constraint(equalTo: webView.centerXAnchor),
            cargando.centerYAnchor.constraint(equalTo: webView.centerYAnchor),
        ])
        cargando.startAnimating()
    }

    private func cargarSitio() {
        var pedido = URLRequest(url: Config.sitio)
        pedido.cachePolicy = .reloadRevalidatingCacheData
        webView.load(pedido)
    }

    @objc private func recargar() {
        vistaSinConexion.isHidden = true
        webView.reload()
    }

    // MARK: - Pantalla de "sin conexión"

    private func crearVistaSinConexion() -> UIView {
        let caja = UIView()
        caja.backgroundColor = Config.colorFondo
        caja.isHidden = true
        caja.translatesAutoresizingMaskIntoConstraints = false

        let titulo = UILabel()
        titulo.text = "No connection"
        titulo.font = .systemFont(ofSize: 20, weight: .bold)
        titulo.textColor = .white
        titulo.textAlignment = .center

        let detalle = UILabel()
        detalle.text = "Check your internet and try again."
        detalle.font = .systemFont(ofSize: 14)
        detalle.textColor = UIColor(white: 0.72, alpha: 1)
        detalle.textAlignment = .center
        detalle.numberOfLines = 0

        let boton = UIButton(type: .system)
        boton.setTitle("Retry", for: .normal)
        boton.setTitleColor(.black, for: .normal)
        boton.titleLabel?.font = .systemFont(ofSize: 15, weight: .semibold)
        boton.backgroundColor = Config.colorMarca
        boton.layer.cornerRadius = 22
        boton.addTarget(self, action: #selector(recargar), for: .touchUpInside)
        boton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            boton.widthAnchor.constraint(equalToConstant: 140),
            boton.heightAnchor.constraint(equalToConstant: 44),
        ])

        let pila = UIStackView(arrangedSubviews: [titulo, detalle, boton])
        pila.axis = .vertical
        pila.alignment = .center
        pila.spacing = 14
        pila.translatesAutoresizingMaskIntoConstraints = false

        caja.addSubview(pila)
        view.addSubview(caja)

        NSLayoutConstraint.activate([
            caja.topAnchor.constraint(equalTo: view.topAnchor),
            caja.bottomAnchor.constraint(equalTo: barra.topAnchor),
            caja.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            caja.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            pila.centerXAnchor.constraint(equalTo: caja.centerXAnchor),
            pila.centerYAnchor.constraint(equalTo: caja.centerYAnchor),
            pila.leadingAnchor.constraint(greaterThanOrEqualTo: caja.leadingAnchor, constant: 32),
            pila.trailingAnchor.constraint(lessThanOrEqualTo: caja.trailingAnchor, constant: -32),
        ])
        return caja
    }

    private func mostrarSinConexion(_ mostrar: Bool) {
        vistaSinConexion.isHidden = !mostrar
        if mostrar { view.bringSubviewToFront(vistaSinConexion) }
    }

    // MARK: - Abrir enlaces

    /// Enlace web común → hoja deslizable DENTRO de la app.
    private func abrirEnApp(_ url: URL) {
        let vc = SFSafariViewController(url: url)
        vc.preferredControlTintColor = Config.colorMarca
        vc.dismissButtonStyle = .close
        present(vc, animated: true)
    }

    /// Perfiles, itms-services y apps nativas → afuera (Safari / sistema).
    private func abrirAfuera(_ url: URL) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
}

// MARK: - Barra de pestañas

extension WebViewController: UITabBarDelegate {

    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        guard item.tag < ModoApp.pestanas.count else { return }
        cambiarSeccion(id: ModoApp.pestanas[item.tag].id, hapticar: true)
    }
}

// MARK: - Mensajes del sitio → app

extension WebViewController: WKScriptMessageHandler {

    func userContentController(_ userContentController: WKUserContentController,
                              didReceive message: WKScriptMessage) {
        guard message.name == ModoApp.canal,
              let cuerpo = message.body as? [String: Any] else { return }

        switch cuerpo["tipo"] as? String {
        case "seccion":
            // El sitio nos dice qué sección quedó activa → sincronizamos
            // la pestaña. (No tocamos el sitio para no hacer un bucle.)
            if let id = cuerpo["id"] as? String {
                seleccionarPestana(id: id)
                if id != "guide" { guia.view.isHidden = true }
            }

        case "guia":
            // Llegaron los pasos de la guía desde el sitio → armamos el carrusel.
            let titulo = cuerpo["titulo"] as? String ?? "Guide"
            let descripcion = cuerpo["descripcion"] as? String ?? ""
            let crudos = cuerpo["pasos"] as? [[String: Any]] ?? []
            let pasos = crudos.map {
                PasoGuia(titulo: $0["titulo"] as? String ?? "",
                         detalle: $0["detalle"] as? String ?? "")
            }
            guia.cargar(titulo: titulo, descripcion: descripcion, pasos: pasos)

        default:
            break
        }
    }
}

// MARK: - Navegación del WebView

extension WebViewController: WKNavigationDelegate {

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        let esquema = (url.scheme ?? "").lowercased()

        // 1) Esquemas que no son web (itms-services://, tg://, mailto:...)
        //    → los maneja el sistema, no el WebView.
        if esquema != "http" && esquema != "https" {
            abrirAfuera(url)
            decisionHandler(.cancel)
            return
        }

        // 2) Perfiles de configuración: SOLO se instalan desde Safari.
        if url.pathExtension.lowercased() == "mobileconfig" {
            abrirAfuera(url)
            decisionHandler(.cancel)
            return
        }

        let anfitrion = url.host ?? ""
        let esPropio = Config.dominiosPropios.contains { anfitrion.hasSuffix($0) }

        // 3) Enlaces a otros sitios.
        if !esPropio && navigationAction.navigationType == .linkActivated {
            // Telegram y compañía → su app nativa. El resto → hoja in-app.
            if Config.dominiosApp.contains(where: { anfitrion.hasSuffix($0) }) {
                abrirAfuera(url)
            } else {
                abrirEnApp(url)
            }
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        cargando.stopAnimating()
        refresco.endRefreshing()
        mostrarSinConexion(false)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        fallo(error)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        fallo(error)
    }

    private func fallo(_ error: Error) {
        cargando.stopAnimating()
        refresco.endRefreshing()

        // -999 = navegación cancelada por nosotros mismos, no es un error real
        if (error as NSError).code == NSURLErrorCancelled { return }
        mostrarSinConexion(true)
    }
}

// MARK: - Ventanas emergentes (target="_blank")

extension WebViewController: WKUIDelegate {

    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url {
            let esquema = (url.scheme ?? "").lowercased()
            if esquema == "http" || esquema == "https" {
                abrirEnApp(url)
            } else {
                abrirAfuera(url)
            }
        }
        return nil
    }
}
