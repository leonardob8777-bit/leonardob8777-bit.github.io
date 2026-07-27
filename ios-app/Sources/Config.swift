//
//  Config.swift
//  LB — iOS Hub
//
//  👉 ACÁ SE CAMBIA TODO LO IMPORTANTE DE LA APP.
//  Si algún día cambiás de dominio, tocás solo `sitio`.
//

import UIKit

enum Config {

    /// La página que carga la app.
    static let sitio = URL(string: "https://leonardob8777-bit.github.io/")!

    /// Fondo mientras carga (mismo color que el sitio, así no
    /// aparece un flash blanco al abrir).
    static let colorFondo = UIColor(red: 0.012, green: 0.031, blue: 0.024, alpha: 1)

    /// Verde de la marca, para el indicador de carga y los botones.
    static let colorMarca = UIColor(red: 0.157, green: 1.0, blue: 0.510, alpha: 1)

    /// Dominios que se abren DENTRO del WebView principal (el sitio).
    static let dominiosPropios = ["leonardob8777-bit.github.io"]

    /// Hosts que conviene abrir en su APP NATIVA (no en el navegador
    /// in-app), porque tienen una app mucho mejor que su web.
    static let dominiosApp = ["t.me", "telegram.me", "telegram.org"]

    /// Se agrega al User-Agent del WebView. Sirve para que el sitio
    /// pueda detectar (`/LBApp/`) que está corriendo dentro de la app.
    static let userAgentApp = "LBApp/1.0"
}
