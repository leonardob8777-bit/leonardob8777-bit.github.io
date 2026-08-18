# leonardob8777-bit.github.io

Sitio personal de **Leonardo Baptiste** — desarrollador iOS.
Presenta las apps propias (Vendor, Eagle, duck), los repositorios de
código abierto, una guía de instalación y los canales de contacto.

En vivo: <https://leonardob8777-bit.github.io/>

HTML + CSS + JavaScript sin frameworks, sin backend y sin paso de
compilación. Alojado en GitHub Pages.

---

## Estructura

```
├── index.html            → todo el contenido de la página
├── styles.css            → diseño completo (claro y oscuro)
├── script.js             → tema, nav activa y aparición al hacer scroll
├── 404.html              → página de error
├── manifest.webmanifest  → permite "Añadir a inicio" en el iPhone
└── assets/               → imágenes, íconos y la fuente
```

Las descargas de apps apuntan a las *releases* de GitHub, así que el
repositorio no guarda ningún `.ipa`. Las apps y perfiles antiguos
(Lara, LB, los `.mobileconfig`) se eliminaron; siguen en el historial
de git si alguna vez hicieran falta.

Todo el contenido vive en `index.html`. La página funciona con
JavaScript desactivado: el script solo añade el cambio de tema, el
resaltado de la sección actual y una aparición suave al hacer scroll.

---

## Cómo editar

**Cambiar textos, apps o enlaces** → `index.html`. Cada sección está
marcada con un comentario (`APPS`, `OPEN SOURCE`, `GUIDE`, `CONTACT`).

**Publicar una versión nueva de una app** → no hace falta tocar nada:
los botones apuntan a `/releases/latest` en GitHub. Solo actualizá el
número de versión y el tamaño en el bloque `app__meta` de esa tarjeta.

**Después de editar `styles.css` o `script.js`** → subí el número de
`?v=` en `index.html` (y en `404.html`), o los visitantes seguirán
viendo la versión vieja en caché. Lo mismo vale para la foto de perfil:
si la reemplazás, subí el `?v=` de `assets/avatar.jpg`.

---

## Diseño

La paleta sale del tema de la app Vendor
(`Vendor/Views/VendorTheme.swift`) a propósito, para que la web y la
app se lean como un mismo producto. El color de marca es
`#6C5CE7` en claro y `#8B7CF6` en oscuro; si cambia en la app, hay que
cambiarlo también en `styles.css`.

La fuente (Space Grotesk) está alojada en este mismo repositorio: la
página no hace ni un solo pedido a terceros, no usa cookies y no lleva
analíticas.

---

## Probar en local

```bash
python3 -m http.server 4321
```

Y abrir <http://localhost:4321>.
