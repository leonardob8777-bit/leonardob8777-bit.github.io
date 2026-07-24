# Link in Bio 🔗

Sitio web estático tipo "link in bio" (estilo Linktree, pero 100% propio).
Hecho con **HTML + CSS + JavaScript vanilla**. Sin frameworks, sin backend,
sin base de datos y sin build step: funciona abriendo `index.html` en el
navegador y se puede alojar gratis en **GitHub Pages**.

## 📁 Estructura del proyecto

```
link-in-bio/
├── index.html          → esqueleto + meta tags (SEO, Open Graph, Twitter)
├── styles.css          → todo el diseño; las variables de tema están arriba
├── script.js           → el array `links` (tus botones) + el renderizado
├── assets/
│   ├── avatar.jpg      → tu foto de perfil (reemplazá el placeholder)
│   ├── favicon.svg     → ícono de la pestaña del navegador
│   └── og-image.jpg    → imagen que se ve al compartir el link (1200x630)
└── archivos/
    └── certificados.zip → el archivo descargable (reemplazá el placeholder)
```

Para verlo en tu compu, simplemente hacé doble clic en `index.html`.

---

## a) 🚀 Cómo subirlo a GitHub Pages (desde cero)

GitHub Pages sirve tu sitio gratis en una URL pública. Pasos:

### 1. Crear una cuenta y un repositorio

1. Entrá a [github.com](https://github.com) y creá una cuenta (si no tenés).
2. Arriba a la derecha, clic en **+** → **New repository**.
3. **Repository name**: elegí un nombre. Tenés dos opciones:
   - **`TU-USUARIO.github.io`** → tu sitio quedará en
     `https://TU-USUARIO.github.io/` (URL más corta, recomendado para bio).
   - Cualquier otro nombre (ej. `links`) → quedará en
     `https://TU-USUARIO.github.io/links/`.
4. Marcá el repositorio como **Public**.
5. Clic en **Create repository**.

### 2. Subir los archivos

**Opción fácil (sin instalar nada), desde la web:**

1. En la página del repo recién creado, clic en **uploading an existing file**
   (o **Add file** → **Upload files**).
2. Arrastrá **todo el contenido** de la carpeta `link-in-bio` (el
   `index.html`, `styles.css`, `script.js` y las carpetas `assets/` y
   `archivos/`). ⚠️ Subí los archivos y carpetas, no la carpeta contenedora.
3. Abajo, clic en **Commit changes**.

**Opción con Git (si lo tenés instalado):**

```bash
cd link-in-bio
git init
git add .
git commit -m "Primer commit: link in bio"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. En el repo, andá a **Settings** (arriba).
2. En el menú de la izquierda, clic en **Pages**.
3. En **Source**, elegí **Deploy from a branch**.
4. En **Branch**, elegí **main** y carpeta **/ (root)**. Clic en **Save**.
5. Esperá 1–2 minutos y recargá. Arriba va a aparecer tu URL pública:
   `https://TU-USUARIO.github.io/TU-REPO/` 🎉

### 4. Ajustar las URLs de las meta tags

Una vez que sepas tu URL final, abrí `index.html` y actualizá estas líneas
del `<head>` con tu dirección real (importante para que la tarjeta al
compartir se vea bien):

```html
<meta property="og:url" content="https://TU-USUARIO.github.io/TU-REPO/" />
<meta property="og:image" content="https://TU-USUARIO.github.io/TU-REPO/assets/og-image.jpg" />
<meta name="twitter:image" content="https://TU-USUARIO.github.io/TU-REPO/assets/og-image.jpg" />
```

> 💡 Para la imagen de compartir (Open Graph), conviene usar la **URL
> absoluta completa**. Servicios como WhatsApp o Telegram no siempre
> resuelven las rutas relativas.

---

## b) ➕ Cómo agregar un botón nuevo

Todo se maneja desde el array `links` en **`script.js`**. No tocás el HTML.

1. Abrí `script.js`.
2. Encontrá el array `const links = [ ... ]` (está arriba de todo).
3. Copiá un bloque `{ ... }` y agregalo donde quieras (el orden del array =
   el orden en pantalla). Ejemplo:

```js
{
  id: "instagram",              // identificador único, sin espacios
  titulo: "Instagram",          // texto grande del botón
  subtitulo: "Seguime acá",     // texto chico (o "" si no querés)
  url: "https://instagram.com/tuusuario",
  icono: "link",                // nombre de un ícono del objeto ICONS
  tipo: "externo",              // 'externo' (nueva pestaña) o 'descarga'
},
```

4. Guardá y recargá. Listo.

### ¿Y si quiero un ícono propio?

En `script.js`, buscá el objeto `ICONS` y agregá tu SVG con una clave nueva:

```js
const ICONS = {
  // ...los que ya están...
  instagram: `<svg viewBox="0 0 24 24" ...>...</svg>`,
};
```

- Usá `fill="currentColor"` o `stroke="currentColor"` en el SVG para que
  tome automáticamente el color del texto del botón.
- Después referencialo con `icono: "instagram"` en tu enlace.
- Si ponés un nombre de ícono que no existe, se usa un ícono genérico de
  respaldo (no rompe nada).

---

## c) 📄 Cómo reemplazar el archivo de certificados

El botón "Descargar Certificados" apunta a `archivos/certificados.zip`.

**Opción simple (mismo nombre):**

1. Borrá el `certificados.zip` de ejemplo que está en la carpeta `archivos/`.
2. Poné tu `.zip` real ahí con **exactamente el mismo nombre**
   (`certificados.zip`). No hace falta tocar nada más.

**Si querés otro nombre o formato (ej. un PDF):**

1. Poné tu archivo en `archivos/` (ej. `archivos/mis-certificados.pdf`).
2. En `script.js`, en el objeto del botón, cambiá la `url`:

```js
url: "archivos/mis-certificados.pdf",
```

> El atributo `download` que fuerza la descarga se agrega solo cuando
> `tipo: "descarga"`. Dejalo así para que el archivo se baje en vez de
> abrirse en el navegador.

---

## d) 🎨 Cómo cambiar los colores del tema

Todos los colores salen de las **variables CSS** al principio de
`styles.css`, dentro del bloque `:root`. Cambiás ahí y se actualiza todo el
sitio.

```css
:root {
  --bg: #0b0d1a;          /* fondo base (lo más oscuro) */

  --aurora-1: #6d28d9;    /* violeta ─┐                          */
  --aurora-2: #2563eb;    /* azul    ─┤ el gradiente animado     */
  --aurora-3: #db2777;    /* rosa    ─┘ del fondo                */

  --text:       #f4f5fb;  /* texto principal    */
  --text-muted: #a9b0c9;  /* texto secundario   */

  --glass-bg:     rgba(255,255,255,0.06);  /* relleno de los botones */
  --glass-border: rgba(255,255,255,0.14);  /* borde de 1px           */
  --glass-blur:   18px;                     /* intensidad del blur    */

  --radius-card: 24px;    /* redondez de la tarjeta */
  --radius-btn:  20px;    /* redondez de los botones */
}
```

**Ideas rápidas:**

- **Tema más frío (azul/cyan):** `--aurora-1: #0ea5e9; --aurora-2: #6366f1; --aurora-3: #06b6d4;`
- **Tema atardecer (naranja/rosa):** `--aurora-1: #f59e0b; --aurora-2: #ef4444; --aurora-3: #ec4899;`
- **Menos brillo del fondo:** bajá el `opacity` de `.aurora` (más abajo en el CSS).
- **Botones más/menos transparentes:** subí o bajá el último número (el alpha)
  de `--glass-bg`.

Recordá cambiar también el color del favicon (`assets/favicon.svg`) y de la
`--avatar-glow` si querés que todo combine.

---

## ♿ Accesibilidad y rendimiento

Este sitio ya viene con:

- HTML semántico (`<main>`, `<header>`, `<nav>`, `<footer>`).
- `aria-label` en cada botón y `aria-hidden` en lo decorativo.
- Navegación por teclado (Tab + Enter) con foco visible.
- Respeto por `prefers-reduced-motion` (apaga animaciones si el usuario lo pidió).
- Carga rápida: fuente con `preconnect`, imagen con dimensiones fijas.

---

## 🛠️ Probar cambios localmente

Abrí `index.html` con doble clic. Si algún navegador bloquea la carga del
`.js` por seguridad al abrir archivos locales, levantá un servidor simple:

```bash
python -m http.server 8000
```

Y entrá a `http://localhost:8000`.
