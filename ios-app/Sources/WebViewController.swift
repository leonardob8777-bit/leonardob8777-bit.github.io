//
//  WebViewController.swift
//  LB — iOS Hub
//
//  Pantalla única: un WKWebView a pantalla completa con el sitio.
//
//  ⚠️ LO MÁS IMPORTANTE DE ESTE ARCHIVO
//  iOS NO permite instalar perfiles de configuración (.mobileconfig)
//  desde dentro de una app: solo funcionan abiertos en Safari.
//  Lo mismo pasa con los enlaces de instalación `itms-services://`.
//  Por eso, cuando el usuario toca esos botones, los mandamos AFUERA
//  con UIApplication.open en vez de intentar cargarlos acá dentro.
//  Si no se hiciera esto, los botones principales del sitio no
//  funcionarían dentro de la app.
//

import UIKit
import WebKit

final class WebViewController: UIViewController {

    private var webView: WKWebView!
    private let refresco = UIRefreshControl()
    private lazy var vistaSinConexion = crearVistaSinConexion()
    private let cargando = UIActivityIndicatorView(style: .medium)

    // MARK: - Ciclo de vida

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Config.colorFondo

        configurarWebView()
        configurarCargando()
        cargarSitio()
    }

    /// Barra de estado en blanco (el sitio es oscuro).
    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    /// Deja que el contenido llegue hasta los bordes de la pantalla.
    override var prefersHomeIndicatorAutoHidden: Bool { false }

    // MARK: - Armado

    private func configurarWebView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.defaultWebpagePreferences.allowsContentJavaScript = true

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
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
    }

    private func configurarCargando() {
        cargando.color = Config.colorMarca
        cargando.hidesWhenStopped = true
        cargando.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(cargando)
        NSLayoutConstraint.activate([
            cargando.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            cargando.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
        cargando.startAnimating()
    }

    private func cargarSitio() {
        // `reloadIgnoringLocalCacheData` evita que quede pegada una
        // versión vieja de la página en el caché de la app.
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
        boton.contentEdgeInsets = UIEdgeInsets(top: 12, left: 28, bottom: 12, right: 28)
        boton.addTarget(self, action: #selector(recargar), for: .touchUpInside)

        let pila = UIStackView(arrangedSubviews: [titulo, detalle, boton])
        pila.axis = .vertical
        pila.alignment = .center
        pila.spacing = 14
        pila.translatesAutoresizingMaskIntoConstraints = false

        caja.addSubview(pila)
        view.addSubview(caja)

        NSLayoutConstraint.activate([
            caja.topAnchor.constraint(equalTo: view.topAnchor),
            caja.bottomAnchor.constraint(equalTo: view.bottomAnchor),
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
}

// MARK: - Navegación

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
        //    Es la razón por la que hay que sacarlos de la app.
        if url.pathExtension.lowercased() == "mobileconfig" {
            abrirAfuera(url)
            decisionHandler(.cancel)
            return
        }

        // 3) Enlaces a otros sitios (Telegram, MediaFire, KravaSign…)
        //    → afuera, así se abren en su app nativa si existe.
        let anfitrion = url.host ?? ""
        let esPropio = Config.dominiosPropios.contains { anfitrion.hasSuffix($0) }

        if !esPropio && navigationAction.navigationType == .linkActivated {
            abrirAfuera(url)
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

    private func abrirAfuera(_ url: URL) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
}

// MARK: - Ventanas emergentes

extension WebViewController: WKUIDelegate {

    /// Los enlaces con target="_blank" no abren ventana nueva dentro
    /// de la app: los mandamos afuera.
    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
        return nil
    }
}
