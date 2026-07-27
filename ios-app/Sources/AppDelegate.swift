//
//  AppDelegate.swift
//  LB — iOS Hub
//
//  Arranque de la app. No usa storyboards: crea la ventana a mano y
//  pone WebViewController como pantalla principal.
//

import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {

        let ventana = UIWindow(frame: UIScreen.main.bounds)
        ventana.rootViewController = WebViewController()
        ventana.backgroundColor = Config.colorFondo
        ventana.makeKeyAndVisible()
        window = ventana

        return true
    }
}
