# leonardob8777-bit.github.io

Sitio personal de **Leonardo B.** — desarrollador iOS.
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

## Seguridad

La página lleva una **Content-Security-Policy** estricta en un `<meta>`
de `index.html` y `404.html`. Parte de `default-src 'none'`: el navegador
rechaza todo lo que no esté nombrado. Como todo lo que la página necesita
es del propio dominio, **ningún host externo está permitido** — un script
inyectado, un píxel de rastreo o un `fetch()` a otro dominio son
bloqueados por el navegador, no por confianza.

Probado: script externo, script inline sin hash, píxel de Google
Analytics y `fetch()` a otro dominio → los cuatro bloqueados.

**Dos reglas al editar:**

1. El script inline del tema está permitido **por su hash SHA-256**, no
   por `'unsafe-inline'`. Si lo tocas —aunque sea un espacio— hay que
   recalcular el hash o dejará de ejecutarse:

   ```bash
   python3 -c "import re,hashlib,base64;s=open('index.html').read();b=re.search(r'<script>(.*?)</script>',s,re.S).group(1);print('sha256-'+base64.b64encode(hashlib.sha256(b.encode()).digest()).decode())"
   ```

2. **No uses `style=\"...\"` ni `<style>`**: la política prohíbe estilos
   inline. Todo el CSS va en `styles.css`.

**Lo que la CSP no cubre:** `frame-ancestors` (evitar que te metan en un
iframe) solo funciona como cabecera HTTP real, y GitHub Pages no permite
enviar cabeceras propias. Para eso haría falta poner un CDN delante
(Cloudflare) con un dominio propio.

**Dónde está el riesgo real:** la página es HTML estático, sin login ni
base de datos ni formularios — no hay nada que atacar en ella. El único
camino para modificarla es entrar a la cuenta de GitHub. La seguridad de
verdad son el 2FA y las llaves de acceso de esa cuenta, no el código.

## Probar en local

```bash
python3 -m http.server 4321
```

Y abrir <http://localhost:4321>.
