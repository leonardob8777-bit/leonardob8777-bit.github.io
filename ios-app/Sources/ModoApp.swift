//
//  ModoApp.swift
//  LB — iOS Hub
//
//  Todo lo específico de "modo app": las pestañas de la barra inferior
//  y el código que se inyecta en el sitio para que se sienta una app
//  de verdad y no una página web metida en una ventana.
//
//  ⚠️ IDEA CLAVE: el sitio NO se toca. La app le inyecta un poco de CSS
//  y JS al vuelo. Por eso no hay que subir el `?v=` ni hacer push del
//  sitio para cambiar el comportamiento dentro de la app: se cambia acá
//  y sale en el próximo build del .ipa.
//

import Foundation

enum ModoApp {

    /// Una pestaña de la barra inferior. El `id` DEBE coincidir con el id
    /// de la sección en el sitio (script.js → array SECCIONES).
    struct Pestana {
        let id: String
        let titulo: String
        let simbolo: String   // nombre de un SF Symbol
    }

    /// Las pestañas, en orden. Si en el sitio agregás o renombrás una
    /// sección, actualizá esta lista para que la barra la refleje.
    static let pestanas: [Pestana] = [
        Pestana(id: "live",    titulo: "Live",    simbolo: "dot.radiowaves.left.and.right"),
        Pestana(id: "apps",    titulo: "Apps",    simbolo: "square.grid.2x2.fill"),
        Pestana(id: "certs",   titulo: "Certs",   simbolo: "checkmark.seal.fill"),
        Pestana(id: "guide",   titulo: "Guide",   simbolo: "book.fill"),
        Pestana(id: "tools",   titulo: "Tools",   simbolo: "wrench.and.screwdriver.fill"),
        Pestana(id: "contact", titulo: "Contact", simbolo: "paperplane.fill"),
    ]

    /// Nombre del canal por el que el sitio le habla a la app
    /// (window.webkit.messageHandlers.lbapp).
    static let canal = "lbapp"

    /// CSS que se inyecta al cargar. Como la barra NATIVA reemplaza al
    /// menú de categorías del sitio, lo ocultamos para no duplicarlo.
    /// Se puede agregar acá cualquier ajuste "solo para la app".
    static let css = """
    html.in-app .catnav { display: none !important; }
    html.in-app main { margin-top: 6px; }
    """

    /// Puente JS. Hace tres cosas:
    ///  1. Marca la página como `in-app` (para que aplique el CSS de arriba).
    ///  2. Avisa a la app qué sección está activa, así la barra inferior
    ///     se mantiene sincronizada aunque el usuario navegue desde una
    ///     tarjeta (esos clics usan replaceState y no disparan hashchange).
    ///  3. Expone `window.LBApp.show(id)` para que la app cambie de sección
    ///     al tocar una pestaña.
    static let js = """
    (function () {
      document.documentElement.classList.add('in-app');

      function seccionActiva() {
        var s = document.querySelector('main .section.is-active');
        return s ? s.id : null;
      }
      function avisar() {
        var id = seccionActiva();
        var mh = window.webkit && webkit.messageHandlers && webkit.messageHandlers.\(canal);
        if (id && mh) { mh.postMessage({ tipo: 'seccion', id: id }); }
      }

      // Cada vez que cambia la sección activa (por hash, tarjeta o teclado),
      // avisamos a la app para que sincronice la pestaña seleccionada.
      var main = document.querySelector('main');
      if (main) {
        new MutationObserver(avisar).observe(main, {
          subtree: true, attributes: true, attributeFilter: ['class']
        });
      }
      setTimeout(avisar, 300);

      // Le mandamos a la app los pasos de la GUÍA (tomados del array
      // SECCIONES del sitio) para que arme el carrusel nativo. Así la
      // guía tiene una sola fuente de verdad: si editás el sitio, el
      // carrusel se actualiza solo en el próximo build.
      function enviarGuia() {
        try {
          if (typeof SECCIONES === 'undefined') return false;
          var g = SECCIONES.filter(function (s) { return s.id === 'guide'; })[0];
          if (!g || !g.pasos) return false;
          var mh = window.webkit && webkit.messageHandlers && webkit.messageHandlers.\(canal);
          if (!mh) return false;
          mh.postMessage({
            tipo: 'guia',
            titulo: g.titulo || 'Guide',
            descripcion: g.descripcion || '',
            pasos: g.pasos.map(function (p) {
              return { titulo: p.titulo || '', detalle: p.detalle || '' };
            })
          });
          return true;
        } catch (e) { return false; }
      }
      if (!enviarGuia()) { setTimeout(enviarGuia, 500); }

      // La app llama esto al tocar una pestaña de la barra inferior.
      window.LBApp = {
        show: function (id) {
          if (typeof mostrarSeccion === 'function') {
            mostrarSeccion(id);
            history.replaceState(null, '', '#' + id);
          } else {
            location.hash = '#' + id;
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
    })();
    """
}
