# Leonardo Bt · iOS Hub

Sitio web estático con estética *cyber / liquid glass*: categorías en
pestañas, malla animada de fondo, glitches aleatorios e instalación de
apps iOS (OTA) desde el propio dominio.

Hecho con **HTML + CSS + JavaScript vanilla**. Sin frameworks, sin
backend, sin base de datos y sin build step. Alojado gratis en
**GitHub Pages**: <https://leonardob8777-bit.github.io/>

---

## 📁 Estructura

```
link-in-bio/
├── index.html      → esqueleto + meta tags (SEO, Open Graph, privacidad)
├── styles.css      → diseño + los 5 temas de color
├── script.js       → CONFIGURACIÓN (lo único que editás) + motor
├── manifest.webmanifest → permite "Agregar a inicio" en el iPhone
├── 404.html        → página de error con el mismo diseño
├── robots.txt / sitemap.xml → SEO
├── assets/
│   ├── avatar.jpg      → foto de perfil
│   ├── favicon.svg     → ícono de la pestaña
│   ├── og-image.jpg    → imagen al compartir el link (1200x630)
│   ├── fonts/          → la tipografía, auto-hospedada (privacidad)
│   ├── lara.png        → logo de la app Lara
│   ├── ksign.png       → logo de KSign
│   └── bg.jpg          → (sin usar; era el fondo de foto anterior)
├── apps/
│   ├── lara.ipa        → la app
│   └── lara.plist      → manifiesto de instalación OTA
└── profiles/
    └── anti-revoke.mobileconfig  → perfil DNS
```

---

## a) ➕ Agregar una tarjeta o una categoría

Todo sale del array `SECCIONES` al principio de **`script.js`**.
Cada elemento del array es **una pestaña**. El orden del array es el
orden del menú: para reordenar, movés el bloque de lugar.

### Tarjeta nueva

Buscá la categoría y copiá un bloque `{ ... }`:

```js
{
  id: "nombre-unico",        // sin espacios
  titulo: "Texto grande",
  subtitulo: "Texto chico",  // "" si no querés
  url: "https://...",
  icono: "telegram",         // nombre del objeto ICONS
  tipo: "externo",
  estado: "online",          // opcional
  nota: "",                  // texto extra opcional
}
```

**Tipos disponibles:**

| tipo | qué hace |
|---|---|
| `externo` | abre en pestaña nueva |
| `install` | instalación OTA de iOS (`itms-services://`) |
| `perfil`  | perfil de configuración `.mobileconfig` |
| `descarga`| fuerza la descarga del archivo |
| `interno` | salta a otra categoría (ej. `url: "#guide"`) |

**Estados** (el chip de color): `online` verde · `offline` rojo ·
`soon` ámbar · `live` rojo con latido.

### Categoría nueva

Copiá un bloque entero de `SECCIONES`. El menú se actualiza solo.
Si le agregás `acento: "live"`, la pestaña se pinta de rojo.

### Paso nuevo en la guía

La categoría `guide` usa `pasos` en vez de `items`. Agregás
`{ titulo, detalle }` y el número se pone solo. Podés usar `<b>`.

### Ícono nuevo

En el objeto `ICONS` agregás tu SVG (con `fill="currentColor"`) o una
imagen: `milogo: '<img class="logo" src="assets/milogo.png" alt="" />'`.
Si el nombre no existe, cae en un ícono genérico (no rompe nada).

---

## b) 📲 Actualizar la app instalable (IPA)

El botón instala desde tu propio dominio usando `apps/lara.plist`.

**Cuando el certificado se vence** (la app instala pero no abre):

1. Volvés a firmar la app y conseguís el `.ipa` nuevo.
2. Lo ponés en `apps/` **con el mismo nombre** (`lara.ipa`).
3. Commit + push. **No hay que tocar el `.plist` ni el botón.**

**Para agregar otra app**: copiás `apps/lara.plist` como
`apps/otra.plist`, cambiás dentro la URL del `.ipa`, el
`bundle-identifier` y el `title`; después agregás la tarjeta con
`tipo: "install"` apuntando a:

```
itms-services://?action=download-manifest&url=https://leonardob8777-bit.github.io/apps/otra.plist
```

> ⚠️ GitHub bloquea archivos de más de 100 MB.

---

## c) 🎨 Cambiar los colores

Todo sale del bloque `:root` al principio de `styles.css`:

```css
--bg: #05060a;                          /* fondo base */
--mesh:      rgba(255, 45, 45, 0.16);   /* rejilla principal */
--mesh-fine: rgba(255, 45, 45, 0.055);  /* rejilla micro */
--mesh-glow: rgba(220, 30, 30, 0.22);   /* resplandor */
--text:       #f6f7fc;
--text-muted: #b3b9d1;
--glass-bg:   rgba(255,255,255,0.055);  /* vidrio de las tarjetas */
--glass-blur: 22px;
```

Para pasar la malla a **verde matrix**: cambiá los tres `--mesh*` a
tonos verdes (ej. `rgba(45, 255, 130, 0.16)`).

---

## d) ⚡ Calibrar los glitches

En `script.js`, dentro de `activarGlitches()`, está el bloque `CONFIG`:

```js
fuerteMin: 2200,  // espera mínima entre glitches fuertes (ms)
fuerteMax: 5200,  // espera máxima
fuerteDur: 260,
replica: 0.55,    // probabilidad de una segunda sacudida
microMin: 800,    // micro-glitches (sutiles)
microMax: 2200,
```

Hay **6 variantes** de movimiento (`gv-1` … `gv-6` en el CSS) y
**3 micro** (`mv-1` … `mv-3`). El JS elige una al azar y además
sortea distancia, dirección, duración y ruido en cada disparo, para
que ningún glitch se repita.

---

## e) 🚀 Publicar los cambios

El repo ya está conectado a GitHub Pages (rama `main`, carpeta raíz).

1. Abrís **GitHub Desktop**.
2. Escribís un resumen del cambio abajo a la izquierda → **Commit to main**.
3. Botón **Push origin** (arriba).
4. En 1–2 minutos se actualiza el sitio.

### ⚠️ Importante: la caché

Si cambiás `styles.css` o `script.js`, **subí el número de versión**
en `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=17" />
<script src="script.js?v=17" defer></script>
```

Si no lo hacés, los visitantes que ya entraron pueden seguir viendo la
versión vieja guardada en su navegador.

---

## 🛠️ Probar antes de publicar

Doble clic en `index.html`, o desde la terminal:

```bash
python -m http.server 8000
```

y entrás a `http://localhost:8000`.

> Los enlaces de instalación de iOS (`itms-services://`) **solo
> funcionan desde el Safari de un iPhone y por HTTPS** — en la compu no
> hacen nada, es normal.

---

## ♿ Accesibilidad y rendimiento

- Pestañas con `role="tab"` / `tabpanel` y navegación por flechas.
- Enlace "Skip to content" para teclado.
- Aviso visible si el visitante tiene JavaScript desactivado.
- Respeta `prefers-reduced-motion` (apaga malla, glitches y animaciones).
- Animaciones de fondo con `transform` (aceleradas por GPU).
- Respeta las zonas seguras del iPhone (muesca y barra inferior).

---

## f) 🎨 Temas de color

El visitante puede elegir el tema desde la **ruedita** de arriba a la
derecha. Su elección queda guardada en su propio navegador.

Temas incluidos: **Matrix** (verde, por defecto), **Crimson**, **Ice**,
**Amber** y **Violet**.

**Para agregar uno nuevo** hacen falta 2 pasos:

1. En `styles.css`, copiá un bloque y cambiá los colores:

```css
[data-theme="mi-tema"] {
  --bg: #07070d;
  --mesh:       rgba(200, 200, 255, 0.15);
  --mesh-fine:  rgba(200, 200, 255, 0.05);
  --mesh-glow:  rgba(150, 150, 220, 0.20);
  --bit:        rgba(220, 220, 255, 0.85);
  --avatar-glow: #8888dd;
}
```

2. En `script.js`, sumalo al array `TEMAS`:

```js
{ id: "mi-tema", nombre: "Mi Tema", color: "#8888dd" },
```

El `color` es solo el del circulito del selector.

---

## g) 🔒 Privacidad

El sitio **no hace ni un solo pedido a servidores de terceros**:

- La tipografía está **auto-hospedada** (antes venía de Google Fonts, lo
  que le mandaba la IP de cada visitante a Google).
- Sin cookies, sin analítica, sin píxeles de seguimiento.
- `referrer: no-referrer` → cuando alguien toca un enlace, el sitio de
  destino no se entera de que vino de acá.
- Lo único que se guarda es el tema elegido, y queda en **el navegador
  del visitante** (localStorage). No viaja a ningún lado.

Si algún día agregás algo externo (un video incrustado, una fuente, un
contador de visitas), tené en cuenta que rompés esta propiedad.

---

## h) ⚡ Efectos y rendimiento

Desde la ruedita también se pueden **apagar los efectos de fondo**
(malla animada, bits, glitches, escáner). Útil en celulares viejos.
Cuando están apagados, el JS ni siquiera los genera.

El sitio también respeta `prefers-reduced-motion` del sistema.
