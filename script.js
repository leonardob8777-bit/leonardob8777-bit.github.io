/* =================================================================
   CONFIGURACIÓN DE ENLACES  ← ESTO ES LO ÚNICO QUE EDITAS
   -----------------------------------------------------------------
   Cada botón del sitio es un objeto de este array. Para AGREGAR un
   botón nuevo, copiá un bloque { ... } y cambiá sus valores. Para
   QUITAR uno, borrá su bloque. El orden del array = el orden en
   pantalla.

   Campos de cada objeto:
     id        → identificador único (string, sin espacios).
     titulo    → texto grande del botón.
     subtitulo → texto chico debajo (opcional; poné "" si no querés).
     url       → a dónde apunta:
                   · tipo 'externo'  → una URL (https://...)
                   · tipo 'descarga' → la ruta al archivo (archivos/...)
     icono     → nombre de un ícono definido en el objeto ICONS de
                 más abajo. Podés agregar los tuyos ahí.
     tipo      → 'externo'  = abre en pestaña nueva.
                 'descarga' = descarga el archivo (usa download).
   ================================================================= */
const links = [
  {
    id: "ksign",
    titulo: "Install KSign",
    subtitulo: "Tap to install (iOS)",
    // Instalación OTA de iOS: el .plist va envuelto en itms-services://
    // para que iPhone muestre el instalador en vez de abrir el XML.
    url: "itms-services://?action=download-manifest&url=https://signtools.ipaomtk.com/output/KSign-IPAOMTK.COM-signed-b6bc26767fc9db529fa0.plist",
    icono: "ksign",
    tipo: "install", // enlace OTA: misma pestaña, sin target _blank (iOS lo exige)
  },
  {
    id: "kravasign",
    titulo: "KravaSign",
    subtitulo: "Purchase",
    url: "https://www.kravasign.com/purchase", // KravaSign
    icono: "kravasign",
    tipo: "externo",
  },
  {
    id: "udid",
    titulo: "Get UDID",
    subtitulo: "Find your device ID",
    url: "https://udid.tech/", // udid.tech
    icono: "getudid",
    tipo: "externo",
  },
  {
    id: "certificados",
    titulo: "Download Certificates",
    subtitulo: "MediaFire folder",
    url: "https://www.mediafire.com/folder/tfyqtjugh0jtv/Certificate", // carpeta MediaFire
    icono: "mediafire",
    tipo: "externo", // abre MediaFire en pestaña nueva
  },
  {
    id: "telegram",
    titulo: "Telegram",
    subtitulo: "If you need help, text me",
    url: "https://t.me/leonardoPhl", // Telegram
    icono: "telegram",
    tipo: "externo",
  },
];

/* =================================================================
   BIBLIOTECA DE ÍCONOS (SVG inline, sin librerías externas)
   -----------------------------------------------------------------
   Cada clave devuelve el markup de un <svg>. Para agregar un ícono
   nuevo: pegá acá el SVG (usá fill="currentColor" o
   stroke="currentColor" para que herede el color del texto) y
   referencialo desde el campo `icono` de un enlace.
   ================================================================= */
const ICONS = {
  // Logo OFICIAL de Telegram, a color, en círculo (SVG => nítido siempre).
  telegram: `
    <svg class="logo" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="tg" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#2AABEE"/>
          <stop offset="1" stop-color="#229ED9"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#tg)"/>
      <path fill="#fff" d="M54 118.5c34.9-15.2 58.2-25.2 69.8-30.1 33.2-13.8 40.1-16.2 44.6-16.3 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.1.2 4.8-1.8 19.1-9.7 65.4-13.7 86.8-1.7 9-5 12.1-8.2 12.4-7 .6-12.3-4.6-19-9-10.5-6.9-16.4-11.2-26.6-17.9-11.8-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.4-.2-1 .2-17.5 11.1-49.3 32.7-4.7 3.2-8.9 4.8-12.7 4.7-4.2-.1-12.2-2.4-18.2-4.3-7.3-2.4-13.1-3.7-12.6-7.8.3-2.1 3.2-4.3 8.8-6.6z"/>
    </svg>`,

  // Logo real de KSign: imagen circular. Reemplazá assets/ksign.png por el tuyo.
  ksign: `<img class="logo" src="assets/ksign.png" alt="" />`,

  // Logo de MediaFire (llama) a color, en círculo (SVG => nítido siempre).
  mediafire: `
    <svg class="logo" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="mf" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#39A0F4"/>
          <stop offset="1" stop-color="#1E7BE0"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#mf)"/>
      <path fill="#fff" d="M133 46c5 29 31 41 35 76 4 37-23 66-51 66-29 0-51-23-51-51 0-21 11-33 23-45 0 16 6 27 19 31-13-23-4-53 25-76z"/>
    </svg>`,

  // Logo real de KravaSign (la vaquita): imagen circular.
  kravasign: `<img class="logo" src="assets/kravasign.png" alt="" />`,

  // Logo propio para "Get UDID": huella digital en círculo verde-azulado (SVG).
  getudid: `
    <svg class="logo" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="uid" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#22d3aa"/>
          <stop offset="1" stop-color="#0e9488"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#uid)"/>
      <g fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
        <path d="M74 158 V132 a46 46 0 0 1 92 0 V158"/>
        <path d="M100 158 V134 a20 20 0 0 1 40 0 V158"/>
        <path d="M120 158 V120"/>
      </g>
    </svg>`,

  download: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`,

  signature: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 20H4"/>
      <path d="M4 16c4 0 3-8 6-8s2 5 4 5 2-3 4-3"/>
    </svg>`,

  apple: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 2.98-.79.87-2.07 1.54-3.22 1.45-.13-1.1.42-2.27 1.06-2.98.72-.83 2.02-1.45 3.27-1.45zM20.5 17.06c-.6 1.38-.89 1.99-1.66 3.2-1.07 1.68-2.58 3.77-4.45 3.79-1.66.02-2.09-1.08-4.34-1.07-2.25.01-2.72 1.1-4.38 1.08-1.87-.02-3.3-1.9-4.37-3.58-3-4.72-3.31-10.26-1.46-13.2 1.31-2.09 3.38-3.31 5.33-3.31 1.98 0 3.23 1.09 4.87 1.09 1.59 0 2.56-1.09 4.85-1.09 1.73 0 3.57.94 4.88 2.57-4.29 2.35-3.59 8.47.73 10.14z"/>
    </svg>`,

  /* Ícono genérico de respaldo si `icono` no coincide con ninguno */
  link: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/>
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>
    </svg>`,
};

/* Flechita a la derecha de cada botón (indicador visual) */
const ARROW_ICON = `
  <svg class="link__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round"
       stroke-linejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`;

/* =================================================================
   RENDERIZADO: convierte el array `links` en botones del DOM
   -----------------------------------------------------------------
   No necesitás tocar nada de acá para abajo para el uso normal.
   ================================================================= */
function crearBoton(link, indice) {
  // Es un <a>: accesible, navegable por teclado y funciona sin JS-clicks.
  const a = document.createElement("a");
  a.href = link.url;
  a.className = "link animate-in";
  a.id = `link-${link.id}`;

  // Índice para el stagger (lo lee el CSS con var(--i)).
  a.style.setProperty("--i", indice);

  // Comportamiento según el tipo de enlace.
  if (link.tipo === "descarga") {
    // download → fuerza descarga en vez de navegar.
    a.setAttribute("download", "");
  } else if (link.tipo === "install") {
    // OTA install de iOS (itms-services://). Debe abrir en la MISMA
    // pestaña, sin target _blank, o iOS no dispara el instalador.
    // No agregamos ningún atributo extra.
  } else {
    // externo → nueva pestaña + seguridad (rel).
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  // Accesibilidad: etiqueta clara para lectores de pantalla.
  const accion =
    link.tipo === "descarga" ? "Descargar"
    : link.tipo === "install" ? "Instalar"
    : "Abrir";
  a.setAttribute("aria-label", `${accion}: ${link.titulo}`);

  // Ícono (con respaldo a "link" si el nombre no existe).
  const iconoSVG = ICONS[link.icono] || ICONS.link;

  // Subtítulo opcional.
  const subtituloHTML = link.subtitulo
    ? `<span class="link__subtitle">${link.subtitulo}</span>`
    : "";

  a.innerHTML = `
    <span class="link__icon">${iconoSVG}</span>
    <span class="link__text">
      <span class="link__title">${link.titulo}</span>
      ${subtituloHTML}
    </span>
    ${ARROW_ICON}
  `;

  return a;
}

function renderLinks() {
  const contenedor = document.getElementById("links");
  if (!contenedor) return;

  const fragmento = document.createDocumentFragment();
  links.forEach((link, i) => {
    // +1 para que el perfil (arriba) tenga el turno 0 del stagger si quisieras.
    fragmento.appendChild(crearBoton(link, i + 1));
  });

  contenedor.appendChild(fragmento);
}

/* =================================================================
   INICIALIZACIÓN
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderLinks();

  // Año dinámico en el footer.
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
