/* =================================================================
   CONFIGURACIÓN DEL SITIO  ← ESTO ES LO ÚNICO QUE EDITAS
   -----------------------------------------------------------------
   El sitio se arma solo desde el array SECCIONES. Cada elemento es
   una CATEGORÍA (una pestaña del menú) y puede ser de 2 tipos:

     · con `items` → una lista de tarjetas (Apps, Tools, Contact...).
     · con `pasos` → una guía numerada (el apartado "Guide").

   El ORDEN del array = el orden de las pestañas. Para reordenar,
   simplemente movés el bloque de lugar.

   -----------------------------------------------------------------
   CÓMO AGREGAR UNA TARJETA NUEVA
   Buscá la sección donde la querés y copiá un bloque { ... }:

     {
       id: "nombre-unico",        // sin espacios
       titulo: "Texto grande",
       subtitulo: "Texto chico",  // "" si no querés
       url: "https://...",
       icono: "telegram",         // nombre del objeto ICONS (más abajo)
       tipo: "externo",           // externo | install | descarga
       estado: "online",          // online | offline | soon  (opcional)
       nota: "",                  // texto extra opcional debajo
     }

   TIPOS:
     externo  → abre en pestaña nueva.
     install  → instalación OTA de iOS (itms-services://). Misma pestaña.
     descarga → fuerza la descarga del archivo (usa download).

   ESTADOS (el puntito de color de la tarjeta):
     online  → verde   (funcionando)
     hot     → naranja (lo recomendado / destacado)
     ultra   → violeta reluciente (lo más importante de todo)
     offline → rojo    (caído / certificado vencido)
     soon    → ámbar   (próximamente)
     live    → rojo    (en vivo, con latido)

   CÓMO AGREGAR UNA SECCIÓN NUEVA
   Copiá un bloque de SECCIONES entero (con su id, titulo, etc.).
   El menú de categorías de arriba se actualiza solo.
   ================================================================= */

const SECCIONES = [
  /* ---------------------------------------------------------------
     LIVE  (primera categoría — se muestra en rojo en el menú)
     --------------------------------------------------------------- */
  {
    id: "live",
    nav: "Live",
    acento: "live", // pinta la pestaña de rojo con puntito latiendo
    titulo: "Live",
    descripcion: "Start here — install the app and keep your signed apps alive.",
    items: [
      {
        // TU app (el acceso directo a la pantalla de inicio).
        // Va primera y destacada, con el chip ULTRA violeta.
        id: "homescreen",
        titulo: "Install LB DNS Profile",
        subtitulo: "One tap · its own icon",
        url: "profiles/homescreen-app.mobileconfig",
        icono: "appicon",
        tipo: "perfil",
        estado: "ultra",        // chip violeta reluciente
        destacado: true,        // ← se dibuja con el estilo llamativo
        cinta: "Recommended",   // ← texto de la cintita de arriba
        descargas: [1284, 37],  // ← [arranque, por día] (ver CONTADORES)
        nota:
          "One tap and <b>LB</b> lives on your home screen — its own icon, " +
          "full screen, no link to remember. Tap → <b>Settings → Profile Downloaded → Install</b>. " +
          "Removable any time from <b>Settings → General → VPN & Device Management</b>.",
      },
      {
        // Perfil DNS anti-revoke (el de Skibidi Tech)
        id: "dns-profile",
        titulo: "Install DNS Profile",
        subtitulo: "Anti-revoke · iOS",
        url: "profiles/anti-revoke.mobileconfig",
        icono: "shield",
        tipo: "perfil",
        estado: "live",
        cinta: "Recommended",
        descargas: [3942, 61],
        nota:
          "Tap → then open <b>Settings → Profile Downloaded → Install</b>. " +
          "Routes your DNS through Cloudflare Gateway and blocks iOS updates while active.",
      },
      {
        id: "skibiditech",
        titulo: "Skibidi Tech",
        subtitulo: "iOS signing & sideloading",
        url: "https://skibiditech.co/",
        icono: "spark",
        tipo: "externo",
        estado: "live",
      },
    ],
  },

  /* ---------------------------------------------------------------
     APPS / IPAs
     --------------------------------------------------------------- */
  {
    id: "apps",
    nav: "Apps",
    titulo: "Apps & IPAs",
    descripcion: "Tap to install directly on your iPhone (Safari only).",
    items: [
      {
        id: "lara",
        titulo: "Lara",
        subtitulo: "Tap to install (iOS)",
        // Manifiesto alojado en tu propio dominio → instala desde tu página.
        url: "itms-services://?action=download-manifest&url=https://leonardob8777-bit.github.io/apps/lara.plist",
        icono: "lara",
        tipo: "install",
        estado: "online",
        descargas: [2571, 44],
        nota: "Free version — needs a valid certificate to open.",
      },
      {
        id: "lara-ipa",
        titulo: "Lara — IPA file",
        subtitulo: "Download & sign it yourself",
        url: "apps/lara.ipa",
        icono: "lara",
        tipo: "descarga",
        estado: "hot",
        descargas: [1806, 29],
        nota:
          "The raw <b>.ipa</b> file. Download it, then import it into <b>KSign</b> " +
          "and sign it with your certificate — that version opens normally and never expires early.",
      },
      {
        id: "ksign",
        titulo: "KSign",
        subtitulo: "The signer app · get it here",
        // 👇 CAMBIAR si conseguís un enlace de instalación propio.
        url: "https://signtools.ipaomtk.com/",
        icono: "ksign",
        tipo: "externo",
        estado: "online",
        nota:
          "Sign IPAs directly on your iPhone — no computer needed. " +
          "Install it first, then follow the <b>Guide</b> tab.",
      },
    ],
  },

  /* ---------------------------------------------------------------
     CERTIFICADOS
     --------------------------------------------------------------- */
  {
    id: "certs",
    nav: "Certificates",
    titulo: "Certificates",
    descripcion:
      "A certificate is what makes a signed app actually open. Without one, the app installs but iOS blocks it.",
    items: [
      {
        id: "kravasign",
        titulo: "Buy a Certificate",
        subtitulo: "KravaSign · recommended",
        url: "https://www.kravasign.com/purchase",
        icono: "kravasign",
        tipo: "externo",
        estado: "hot",
        nota:
          "Paste your <b>UDID</b> there and complete the purchase. You'll receive a " +
          "<b>.p12</b> file and a <b>.mobileprovision</b> — those two go into KSign. " +
          "A paid certificate lasts up to a year.",
      },
      {
        id: "certificados",
        titulo: "Free Certificates",
        subtitulo: "MediaFire folder",
        url: "https://www.mediafire.com/folder/tfyqtjugh0jtv/Certificate",
        icono: "mediafire",
        tipo: "externo",
        estado: "online",
        descargas: [4318, 52],
        nota: "Shared certificates — they work, but Apple revokes them often.",
      },
    ],
  },

  /* ---------------------------------------------------------------
     GUÍA PASO A PASO
     Esta sección usa `pasos` en vez de `items`. Para agregar un paso,
     copiá un bloque { titulo, detalle }. El número se pone solo.
     Podés usar <b>negrita</b> dentro del detalle.
     --------------------------------------------------------------- */
  {
    id: "guide",
    nav: "Guide",
    titulo: "How to sign your apps",
    descripcion:
      "Full process, from zero to a working app. Takes about 10 minutes — most of it is the purchase.",
    pasos: [
      {
        titulo: "Install KSign",
        detalle:
          "KSign is the app that signs IPAs directly on your iPhone — no computer needed. " +
          "Get it from the <b>Apps</b> tab. After installing, open " +
          "<b>Settings → General → VPN & Device Management</b> and tap <b>Trust</b> on its profile.",
      },
      {
        titulo: "Get your UDID",
        detalle:
          "Your UDID is your device's unique ID — the certificate gets locked to it. " +
          "Open <b>Get UDID</b> in the <b>Tools</b> tab from Safari, follow the steps and " +
          "<b>copy the code</b> it gives you.",
      },
      {
        titulo: "Buy your certificate",
        detalle:
          "Go to <b>kravasign.com/purchase</b> (also in the <b>Certificates</b> tab), " +
          "paste the UDID you just copied and complete the purchase. " +
          "You'll get a <b>.p12</b> file, a <b>.mobileprovision</b> and a <b>password</b>. " +
          "Save all three — you'll need them in the next step.",
      },
      {
        titulo: "Import the certificate into KSign",
        detalle:
          "Open KSign → <b>Certificates</b> → import the <b>.p12</b> and the " +
          "<b>.mobileprovision</b>, then type the password you were given. " +
          "The certificate stays saved: you only do this once.",
      },
      {
        titulo: "Download the IPA",
        detalle:
          "From the <b>Apps</b> tab, download <b>Lara — IPA file</b>. " +
          "It saves to your Files app. Any other IPA works the same way.",
      },
      {
        titulo: "Sign and install",
        detalle:
          "In KSign, pick the IPA, choose your certificate and tap <b>Sign</b>. " +
          "When it finishes, tap <b>Install</b> and confirm on the home screen.",
      },
      {
        titulo: "Done — it opens normally",
        detalle:
          "Signed with your own certificate, the app just works. " +
          "If it ever stops opening, the certificate was revoked: buy a new one and " +
          "re-sign the same IPA. Something not working? Message me on <b>Telegram</b>.",
      },
    ],
  },

  /* ---------------------------------------------------------------
     HERRAMIENTAS
     --------------------------------------------------------------- */
  {
    id: "tools",
    nav: "Tools",
    titulo: "Tools",
    descripcion: "Get your device ID before buying a certificate.",
    items: [
      {
        id: "udid",
        titulo: "Get UDID",
        subtitulo: "Find your device ID",
        url: "https://udid.tech/",
        icono: "getudid",
        tipo: "externo",
        estado: "online",
        nota: "Copy the code it gives you — you'll paste it when buying your certificate.",
      },
    ],
  },

  /* ---------------------------------------------------------------
     CONTACTO
     --------------------------------------------------------------- */
  {
    id: "contact",
    nav: "Contact",
    titulo: "Contact",
    descripcion: "Join the channel for updates, or message me directly.",
    items: [
      {
        // Canal de soporte: primero y destacado
        id: "support-channel",
        titulo: "Support Channel",
        subtitulo: "Updates, help & new releases",
        url: "https://t.me/LBsignapp",
        icono: "telegram",
        tipo: "externo",
        estado: "hot",
        destacado: true,        // estilo llamativo
        cinta: "Recommended",
        nota:
          "The fastest way to stay updated: new IPAs, certificate alerts and " +
          "fixes get posted here first. Join before asking — most questions are " +
          "already answered in the channel.",
      },
      {
        id: "telegram",
        titulo: "Telegram",
        subtitulo: "Private message · stuck on a step?",
        url: "https://t.me/leonardoPhl",
        icono: "telegram",
        tipo: "externo",
        estado: "online",
      },
    ],
  },
];

/* =================================================================
   BIBLIOTECA DE ÍCONOS (SVG inline / imágenes, sin librerías)
   ================================================================= */
const ICONS = {
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

  lara: `<img class="logo" src="assets/lara.png" alt="" loading="lazy" />`,
  ksign: `<img class="logo" src="assets/ksign.png" alt="" loading="lazy" />`,
  kravasign: `<img class="logo" src="assets/kravasign.png" alt="" loading="lazy" />`,

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

  /* El mismo logo que queda en la pantalla de inicio (cuadrado
     redondeado, como un ícono de app real) */
  appicon: `<img class="logo logo--squircle" src="assets/lb-icon.png" alt="" loading="lazy" />`,

  /* Escudo en círculo rojo — para el perfil DNS anti-revoke */
  shield: `
    <svg class="logo" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="shd" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#f87171"/>
          <stop offset="1" stop-color="#b91c1c"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#shd)"/>
      <path fill="#fff" d="M120 48l50 22v46c0 34-21 62-50 76-29-14-50-42-50-76V70l50-22z"/>
      <path fill="#b91c1c" d="M108 132l-18-18-10 10 28 28 52-52-10-10z"/>
    </svg>`,

  /* Ícono propio para servicios externos de firma (rayo en círculo) */
  spark: `
    <svg class="logo" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="spk" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#fb7185"/>
          <stop offset="1" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#spk)"/>
      <path fill="#fff" d="M132 44 78 132h34l-8 64 56-90h-34z"/>
    </svg>`,

  /* Respaldo si el nombre de `icono` no existe */
  link: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/>
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>
    </svg>`,
};

const ARROW_ICON = `
  <svg class="link__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round"
       stroke-linejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`;

/* =================================================================
   CONTADORES DE DESCARGAS
   -----------------------------------------------------------------
   Cada item puede llevar `descargas: [arranque, porDia]`.
   El número NO es aleatorio: se calcula a partir de la fecha real,
   así que:
     · todos los visitantes ven exactamente el mismo número,
     · crece solo con el paso de los días (como uno de verdad),
     · nunca "salta" ni se reinicia al recargar.

   ⚠️ Es una estimación propia, no una cuenta real: un sitio estático
   no puede registrar descargas sin un servidor.

   Para ajustar: subí o bajá los dos números del item. El primero es
   dónde arranca; el segundo, cuántas descargas suma por día.
   ================================================================= */
const DESCARGAS_DESDE = Date.UTC(2026, 6, 26); // 26 jul 2026

function calcularDescargas(base, porDia) {
  const dias = (Date.now() - DESCARGAS_DESDE) / 86400000;
  if (dias <= 0) return base;

  // Pequeña ondulación diaria: sube más algunos días que otros,
  // igual que el tráfico real (fin de semana, viral, etc.)
  const onda = Math.sin(dias / 2.7) * porDia * 0.35;
  return Math.max(base, Math.round(base + dias * porDia + onda));
}

/** 8432 → "8,432" · 12400 → "12.4K" */
function formatearDescargas(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString("en-US");
}

/* Texto que se muestra al lado del puntito de estado de cada tarjeta */
const ETIQUETA_ESTADO = {
  online: "Online",
  offline: "Down",
  soon: "Soon",
  live:  "Live",  // rojo, con latido
  ultra: "Ultra", // violeta reluciente: lo más importante
  hot:  "Hot",  // naranja: lo destacado / recomendado
};

/* =================================================================
   RENDERIZADO — de acá para abajo no hace falta tocar nada
   ================================================================= */

/** Crea una tarjeta (un <a>) a partir de un item. */
function crearTarjeta(item, indice) {
  const a = document.createElement("a");
  a.href = item.url;
  // `destacado: true` en el item → estilo llamativo (borde de color,
  // latido, barrido de luz continuo y cintita).
  a.className = "link reveal" + (item.destacado ? " link--featured" : "");
  a.id = `link-${item.id}`;
  a.style.setProperty("--i", indice);

  if (item.tipo === "descarga") {
    a.setAttribute("download", "");
  } else if (
    item.tipo === "install" ||
    item.tipo === "interno" ||
    item.tipo === "perfil"
  ) {
    // perfil (.mobileconfig) → misma pestaña y SIN download, para que
    // iOS lo tome como perfil de configuración y no como archivo suelto.
    // OTA de iOS y anclas internas → misma pestaña (iOS lo exige en OTA).
  } else {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  const accion =
    item.tipo === "descarga" ? "Download"
    : item.tipo === "install" || item.tipo === "perfil" ? "Install"
    : "Open";
  a.setAttribute("aria-label", `${accion}: ${item.titulo}`);

  const icono = ICONS[item.icono] || ICONS.link;
  const subtitulo = item.subtitulo
    ? `<span class="link__subtitle">${item.subtitulo}</span>`
    : "";

  // Puntito + etiqueta de estado (si el item lo define)
  const estado = item.estado
    ? `<span class="badge badge--${item.estado}">
         <span class="badge__dot"></span>${ETIQUETA_ESTADO[item.estado] || ""}
       </span>`
    : "";

  const nota = item.nota ? `<p class="link__note">${item.nota}</p>` : "";

  // Contador de descargas / instalaciones
  let stat = "";
  if (item.descargas) {
    const n = formatearDescargas(calcularDescargas(item.descargas[0], item.descargas[1]));
    // "installs" para lo que se instala, "downloads" para archivos
    const palabra =
      item.tipo === "perfil" || item.tipo === "install" ? "installs" : "downloads";
    stat = `
      <span class="link__stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        ${n} ${palabra}
      </span>`;
  }

  // Cintita opcional arriba a la derecha ("Recommended", "New"...)
  const cinta = item.cinta
    ? `<span class="link__ribbon">${item.cinta}</span>`
    : "";

  a.innerHTML = `
    <span class="link__shine" aria-hidden="true"></span>
    ${cinta}
    <span class="link__row">
      <span class="link__icon">${icono}</span>
      <span class="link__text">
        <span class="link__title">${item.titulo}${estado}</span>
        ${subtitulo}
        ${stat}
      </span>
      ${ARROW_ICON}
    </span>
    ${nota}
  `;

  // Si un logo no carga (archivo borrado o sin internet), lo cambiamos
  // por el ícono genérico en vez de mostrar la imagen rota.
  a.querySelectorAll("img.logo").forEach((img) => {
    img.addEventListener("error", () => {
      const cont = img.parentElement;
      if (cont) cont.innerHTML = ICONS.link;
    });
  });

  return a;
}

/** Crea una sección completa con su título y sus tarjetas. */
function crearSeccion(seccion, contadorInicial) {
  const sec = document.createElement("section");
  sec.className = "section";
  sec.id = seccion.id;
  // Panel de la pestaña (accesibilidad)
  sec.setAttribute("role", "tabpanel");
  sec.setAttribute("aria-label", seccion.nav);

  sec.innerHTML = `
    <div class="section__head reveal" style="--i:${contadorInicial}">
      <h2 class="section__title">${seccion.titulo}</h2>
      ${seccion.descripcion ? `<p class="section__desc">${seccion.descripcion}</p>` : ""}
    </div>
  `;

  const lista = document.createElement("div");
  lista.className = "links";
  seccion.items.forEach((item, i) => {
    lista.appendChild(crearTarjeta(item, contadorInicial + i + 1));
  });

  sec.appendChild(lista);
  return sec;
}

/** Crea el apartado de la guía paso a paso. */
function crearGuia(guia, contadorInicial) {
  const sec = document.createElement("section");
  sec.className = "section";
  sec.id = guia.id;
  sec.setAttribute("role", "tabpanel");
  sec.setAttribute("aria-label", guia.nav);

  const pasos = guia.pasos
    .map(
      (p, i) => `
      <li class="step reveal" style="--i:${contadorInicial + i + 1}">
        <span class="step__num">${i + 1}</span>
        <div class="step__body">
          <h3 class="step__title">${p.titulo}</h3>
          <p class="step__detail">${p.detalle}</p>
        </div>
      </li>`
    )
    .join("");

  sec.innerHTML = `
    <div class="section__head reveal" style="--i:${contadorInicial}">
      <h2 class="section__title">${guia.titulo}</h2>
      ${guia.descripcion ? `<p class="section__desc">${guia.descripcion}</p>` : ""}
    </div>
    <ol class="steps">${pasos}</ol>
  `;

  return sec;
}

/** Menú de categorías de arriba (funcionan como pestañas). */
function crearNav(entradas) {
  const nav = document.getElementById("catnav");
  if (!nav) return;

  entradas.forEach((e, i) => {
    const a = document.createElement("a");
    a.href = `#${e.id}`;
    a.className = "catnav__item animate-in";
    a.style.setProperty("--i", i + 1);
    a.textContent = e.nav;
    a.setAttribute("role", "tab");
    a.setAttribute("aria-controls", e.id); // enlaza pestaña ↔ panel
    a.dataset.target = e.id;
    // Acento opcional (ej: la categoría "Live" va en rojo con latido)
    if (e.acento) a.dataset.acento = e.acento;
    nav.appendChild(a);
  });
}

/* -----------------------------------------------------------------
   REVELADO AL HACER SCROLL
   Cada tarjeta/paso aparece cuando entra en pantalla. Al cambiar de
   pestaña se reinicia, así la animación se ve de nuevo.
   ----------------------------------------------------------------- */
let observador = null;

function iniciarObservador() {
  if (!("IntersectionObserver" in window)) {
    // Navegador viejo: mostramos todo sin animar.
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-revealed");
          observador.unobserve(entrada.target);
        }
      });
    },
    // rootMargin positivo abajo = se dispara ANTES de que la tarjeta
    // entre en pantalla, así nunca se ve un hueco vacío al scrollear.
    { rootMargin: "0px 0px 35% 0px", threshold: 0 }
  );
}

/** Reinicia y vuelve a observar los elementos de una sección. */
function reiniciarRevelado(seccion) {
  const elementos = seccion.querySelectorAll(".reveal");
  elementos.forEach((el) => el.classList.remove("is-revealed"));

  // Doble rAF: garantiza que el navegador registre el estado inicial
  // antes de volver a animar (si no, el cambio se ve instantáneo).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      elementos.forEach((el) => {
        if (observador) observador.observe(el);
        else el.classList.add("is-revealed");
      });
    });
  });
}

/**
 * Muestra SOLO la categoría pedida y oculta el resto.
 * Así cada apartado tiene únicamente lo suyo: bajando con el mouse
 * nunca aparece el contenido de otra categoría.
 */
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll("main .section");
  const enlaces = document.querySelectorAll(".catnav__item");
  if (!secciones.length) return;

  // Si el id no existe, caemos en la primera sección.
  const existe = [...secciones].some((s) => s.id === id);
  const objetivo = existe ? id : secciones[0].id;

  secciones.forEach((s) => {
    s.classList.toggle("is-active", s.id === objetivo);
    s.setAttribute("aria-hidden", s.id === objetivo ? "false" : "true");
  });

  enlaces.forEach((a) => {
    const activo = a.dataset.target === objetivo;
    a.classList.toggle("is-active", activo);
    a.setAttribute("aria-selected", activo ? "true" : "false");
    // Solo la pestaña activa recibe el foco con Tab; entre pestañas
    // se navega con las flechas (patrón estándar de accesibilidad).
    a.setAttribute("tabindex", activo ? "0" : "-1");
  });

  // Transición de entrada de la sección + revelado escalonado.
  const activa = document.getElementById(objetivo);
  if (activa) {
    activa.classList.remove("is-entering");
    void activa.offsetWidth; // fuerza el reflow para reiniciar la animación
    activa.classList.add("is-entering");
    reiniciarRevelado(activa);
  }
}

/** Conecta los clics del menú y de los enlaces internos (#guide, etc.). */
function activarPestanas() {
  document.addEventListener("click", (ev) => {
    const enlace = ev.target.closest('a[href^="#"]');
    if (!enlace) return;

    const id = enlace.getAttribute("href").slice(1);
    if (!id) return;

    // Solo interceptamos si apunta a una categoría real; así otros
    // enlaces internos (como "Skip to content") siguen funcionando.
    const destino = document.getElementById(id);
    if (!destino || !destino.classList.contains("section")) return;

    ev.preventDefault();
    mostrarSeccion(id);
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Navegación con teclado entre pestañas (flechas, Inicio y Fin).
  const nav = document.getElementById("catnav");
  if (nav) {
    nav.addEventListener("keydown", (ev) => {
      const teclas = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!teclas.includes(ev.key)) return;

      const items = [...nav.querySelectorAll(".catnav__item")];
      const actual = items.findIndex((a) => a.classList.contains("is-active"));
      let siguiente = actual;

      if (ev.key === "ArrowRight") siguiente = (actual + 1) % items.length;
      if (ev.key === "ArrowLeft") siguiente = (actual - 1 + items.length) % items.length;
      if (ev.key === "Home") siguiente = 0;
      if (ev.key === "End") siguiente = items.length - 1;

      ev.preventDefault();
      const destino = items[siguiente];
      mostrarSeccion(destino.dataset.target);
      destino.focus();
    });
  }

  // Permite volver atrás / entrar con un enlace directo (#guide).
  window.addEventListener("hashchange", () => {
    mostrarSeccion(location.hash.slice(1));
  });
}

/** Indicador "live" del hero: resume el estado de todas las tarjetas. */
function actualizarEstado() {
  const cont = document.getElementById("status");
  if (!cont) return;

  const items = SECCIONES.flatMap((s) => s.items || []);
  const caidos = items.filter((i) => i.estado === "offline").length;
  const total = items.length;

  let clase = "is-online";
  let texto = `All systems live · ${total} services`;

  if (caidos > 0) {
    clase = "is-degraded";
    texto = `${caidos} of ${total} services down`;
  }

  cont.classList.add(clase);
  cont.querySelector(".status__text").textContent = texto;
}

/* -----------------------------------------------------------------
   BITS: unos y ceros que aparecen y desaparecen sobre la malla
   -----------------------------------------------------------------
   Se colocan en las celdas de la cuadrícula (34px) para que queden
   alineados con las líneas del fondo. Cada uno tiene su propio ritmo
   y cambia de valor (0 ↔ 1) al terminar cada ciclo.
   Para tener más o menos números, tocá DENSIDAD.
   ----------------------------------------------------------------- */
/* =================================================================
   CONTADOR DE VISITANTES (decorativo)
   -----------------------------------------------------------------
   ⚠️ El número NO es real: un sitio estático no tiene servidor que
   cuente visitas. Es un adorno.

   La clave para que no se note: NO se sortea al azar. Se calcula a
   partir del RELOJ, sumando varias ondas de distinto ritmo. Eso da:

     · Al recargar la página el número SIGUE donde estaba (antes
       saltaba, y eso lo delataba enseguida).
     · Todos los visitantes ven el mismo número al mismo tiempo.
     · Igual sube y baja solo, de a poco, sin repetir un patrón
       reconocible (las ondas tienen períodos que no encajan entre sí).
     · Hay más gente a la tarde/noche que de madrugada, como en la
       vida real.

   Para cambiar el rango, tocá CENTRO y AMPLITUD.
   ================================================================= */
function activarVisitantes() {
  const cont = document.getElementById("viewers");
  const num = document.getElementById("viewers-n");
  if (!cont || !num) return;

  const MIN = 40, MAX = 200;
  const CENTRO = 118;    // valor típico
  const AMPLITUD = 52;   // cuánto se aleja del centro

  /** Devuelve cuántos "visitantes" hay en un instante dado. */
  function visitantesEn(ms) {
    const m = ms / 60000; // minutos

    // Cuatro ondas de períodos que no son múltiplos entre sí: al
    // sumarse nunca vuelven a la misma combinación → no hay bucle.
    const onda =
      Math.sin(m / 14.6) * 0.50 +
      Math.sin(m / 6.2 + 1.7) * 0.27 +
      Math.sin(m / 2.7 + 4.2) * 0.15 +
      Math.sin(m / 1.2 + 2.9) * 0.08;

    // Ciclo del día: pico a la tarde, valle de madrugada
    const hora = (ms % 86400000) / 3600000;
    const ciclo = 0.86 + 0.24 * Math.sin(((hora - 9) / 24) * Math.PI * 2);

    const v = (CENTRO + onda * AMPLITUD) * ciclo;
    return Math.min(MAX, Math.max(MIN, Math.round(v)));
  }

  let anterior = null;

  function refrescar() {
    const v = visitantesEn(Date.now());
    if (v !== anterior) {
      anterior = v;
      num.textContent = v;
      num.classList.remove("is-tick");
      void num.offsetWidth;   // reinicia la animación
      num.classList.add("is-tick");
    }
  }

  refrescar();                 // valor correcto desde el primer instante
  setInterval(refrescar, 3000);

  // Al tocar el ojo se despliega la palabra "visitors"
  cont.addEventListener("click", () => cont.classList.toggle("is-open"));
}

/* =================================================================
   PERSONALIZACIÓN (temas + efectos)
   -----------------------------------------------------------------
   Para agregar un tema: sumá un objeto acá y copiá el bloque
   [data-theme="tu-id"] en styles.css.
   Lo elegido se guarda SOLO en el navegador del visitante
   (localStorage). No se manda a ningún servidor.
   ================================================================= */
const TEMAS = [
  { id: "matrix",  nombre: "Matrix",  color: "#28ff82" },
  { id: "crimson", nombre: "Crimson", color: "#ff2d2d" },
  { id: "ice",     nombre: "Ice",     color: "#3caaff" },
  { id: "amber",   nombre: "Amber",   color: "#ffaf2d" },
  { id: "violet",  nombre: "Violet",  color: "#aa6eff" },
];

const CLAVE_TEMA = "lb-theme";
const CLAVE_FX = "lb-fx";
const CLAVE_CONTRASTE = "lb-contrast";

/** Lee del almacenamiento sin romper si está bloqueado (modo privado). */
function leer(clave) {
  try { return localStorage.getItem(clave); } catch { return null; }
}
function guardar(clave, valor) {
  try { localStorage.setItem(clave, valor); } catch { /* sin permiso: da igual */ }
}

function activarPersonalizacion() {
  const raiz = document.documentElement;
  const cuerpo = document.body;
  const gear = document.getElementById("gear");
  const panel = document.getElementById("panel");
  const cont = document.getElementById("themes");
  const fxBtn = document.getElementById("fx-toggle");
  const shareBtn = document.getElementById("share-btn");
  const contrasteBtn = document.getElementById("contrast-toggle");
  if (!gear || !panel || !cont) return;

  /* ---- Tema ---- */
  let temaActual = leer(CLAVE_TEMA) || "matrix";

  function aplicarTema(id) {
    temaActual = id;
    if (id === "matrix") raiz.removeAttribute("data-theme");
    else raiz.setAttribute("data-theme", id);
    guardar(CLAVE_TEMA, id);

    // La barra del navegador en el celular acompaña el color del tema
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = getComputedStyle(raiz).getPropertyValue("--bg").trim() || "#030806";
    }

    cont.querySelectorAll(".theme-dot").forEach((d) => {
      const activo = d.dataset.tema === id;
      d.classList.toggle("is-active", activo);
      d.setAttribute("aria-pressed", activo ? "true" : "false");
    });
  }

  TEMAS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "theme-dot";
    b.dataset.tema = t.id;
    b.style.background = `radial-gradient(circle at 35% 30%, ${t.color}, rgba(0,0,0,0.85))`;
    b.title = t.nombre;
    b.setAttribute("aria-label", `${t.nombre} theme`);
    b.addEventListener("click", () => aplicarTema(t.id));
    cont.appendChild(b);
  });

  aplicarTema(temaActual);

  /* ---- Efectos de fondo ---- */
  let fxOn = leer(CLAVE_FX) !== "off";

  function aplicarFx(on) {
    fxOn = on;
    cuerpo.classList.toggle("no-fx", !on);
    fxBtn.setAttribute("aria-pressed", on ? "true" : "false");
    guardar(CLAVE_FX, on ? "on" : "off");
  }
  aplicarFx(fxOn);
  fxBtn.addEventListener("click", () => aplicarFx(!fxOn));

  /* ---- Alto contraste ----
     Sube la legibilidad sin cambiar el diseño: baja el ruido del
     fondo y hace las tarjetas casi opacas. Pensado para leer al sol
     desde el celular. */
  let contrasteOn = leer(CLAVE_CONTRASTE) === "on";

  function aplicarContraste(on) {
    contrasteOn = on;
    cuerpo.classList.toggle("hi-contrast", on);
    if (contrasteBtn) contrasteBtn.setAttribute("aria-pressed", on ? "true" : "false");
    guardar(CLAVE_CONTRASTE, on ? "on" : "off");
  }
  if (contrasteBtn) {
    aplicarContraste(contrasteOn);
    contrasteBtn.addEventListener("click", () => aplicarContraste(!contrasteOn));
  }

  /* ---- Compartir (solo si el dispositivo lo soporta) ---- */
  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: document.title,
          text: "iOS signing tools, certificates and guides",
          url: location.origin + location.pathname,
        });
      } catch { /* el usuario canceló */ }
    });
  }

  /* ---- Abrir y cerrar el panel ---- */
  function abrir(si) {
    panel.classList.toggle("is-open", si);
    gear.setAttribute("aria-expanded", si ? "true" : "false");
  }
  gear.addEventListener("click", (e) => {
    e.stopPropagation();
    abrir(!panel.classList.contains("is-open"));
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => abrir(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") abrir(false);
  });
}

/* Puente entre los dos sistemas: activarGlitches() llama a esto para
   corromper los dígitos justo cuando salta un glitch. */
let corromperBits = null;

function activarBits() {
  const capa = document.getElementById("bits");
  if (!capa) return;

  const CELDA = 34;      // debe coincidir con la malla del CSS
  const esMovil = window.matchMedia("(pointer: coarse)").matches;
  // En celular la mitad: 220 elementos animándose a la vez hacían
  // que el scroll se sintiera con tirones.
  const DENSIDAD = esMovil ? 0.045 : 0.075;
  const MAX = esMovil ? 90 : 200;

  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Un dígito suelto o, a veces, una ráfaga tipo paquete de datos. */
  function valor() {
    const r = Math.random();
    if (r < 0.16) {
      // Ráfaga: entre 3 y 7 bits seguidos
      const largo = 3 + Math.floor(Math.random() * 5);
      let s = "";
      for (let i = 0; i < largo; i++) s += Math.random() < 0.5 ? "0" : "1";
      return s;
    }
    return Math.random() < 0.5 ? "0" : "1";
  }

  /** Lo manda a una celda al azar y le cambia el brillo. */
  function reubicar(b, cols, filas) {
    b.style.left = Math.floor(Math.random() * cols) * CELDA + 6 + "px";
    b.style.top = Math.floor(Math.random() * filas) * CELDA + 8 + "px";
    // 1 de cada 6 aparece resaltado, y se re-sortea en cada salto
    b.classList.toggle("hot", Math.random() < 0.17);
  }

  function generar() {
    capa.innerHTML = "";

    const cols = Math.ceil(window.innerWidth / CELDA);
    const filas = Math.ceil(window.innerHeight / CELDA);
    const total = Math.min(Math.round(cols * filas * DENSIDAD), MAX);

    const frag = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const b = document.createElement("b");

      b.textContent = valor();

      // La posición se asigna SIEMPRE. Si no, los números se apilan
      // todos en la esquina superior izquierda.
      reubicar(b, cols, filas);

      if (!reducido) {
        // Ritmo propio: entre 1.6 y 5.5 segundos por ciclo
        b.style.setProperty("--t", (1.6 + Math.random() * 3.9).toFixed(2) + "s");
        b.style.setProperty("--d", (Math.random() * 6).toFixed(2) + "s");

        // El salto lo maneja un único listener delegado en la capa
        // (ver más abajo): 1 listener en vez de 220.
      } else {
        // Sin animaciones CSS: quietos y tenues
        b.style.opacity = "0.55";
      }

      frag.appendChild(b);
    }

    capa.appendChild(frag);
    capa.dataset.cols = cols;
    capa.dataset.filas = filas;
  }

  /* Un solo listener para todos: cada vez que un número termina su
     ciclo salta a otro lugar con otro valor. Los eventos de animación
     burbujean, así que no hace falta uno por elemento. */
  capa.addEventListener("animationiteration", (ev) => {
    const b = ev.target;
    if (b.tagName !== "B") return;
    reubicar(b, Number(capa.dataset.cols) || 40, Number(capa.dataset.filas) || 25);
    b.textContent = valor();
  });

  generar();

  /* Cuando salta un glitch, una parte de los dígitos se "corrompe":
     cambian de valor de golpe, algunos saltan de lugar y se pintan
     con separación RGB por un instante. */
  corromperBits = function (fuerte) {
    const todos = capa.children;
    if (!todos.length) return;

    const cols = Math.ceil(window.innerWidth / CELDA);
    const filas = Math.ceil(window.innerHeight / CELDA);

    // En un glitch fuerte se corrompe ~35%; en un micro, ~10%
    const proporcion = fuerte ? 0.35 : 0.1;
    const cuantos = Math.round(todos.length * proporcion);

    for (let i = 0; i < cuantos; i++) {
      const b = todos[Math.floor(Math.random() * todos.length)];
      b.textContent = valor();
      b.classList.add("corrupt");

      // En los fuertes, algunos además se teletransportan
      if (fuerte && Math.random() < 0.3) reubicar(b, cols, filas);

      setTimeout(() => b.classList.remove("corrupt"), 90 + Math.random() * 220);
    }
  };

  // Rehacer la grilla si cambia el tamaño de la ventana (sin exagerar)
  let temporizador;
  window.addEventListener("resize", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(generar, 350);
  });
}

/* -----------------------------------------------------------------
   GLITCHES ALEATORIOS
   Cada tantos segundos (al azar) le ponemos la clase `is-glitching`
   al <body> por un instante. El CSS se encarga del efecto visual.
   A veces dispara 2 o 3 seguidos, como una interferencia real.
   ----------------------------------------------------------------- */
function activarGlitches() {
  // Respeta a quien pidió menos animaciones en su dispositivo.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cuerpo = document.body;

  /* --- Ajustes: tocá estos números para calibrar el efecto --- */
  const CONFIG = {
    fuerteMin: 2200,  // espera mínima entre glitches fuertes (ms)
    fuerteMax: 5200,  // espera máxima
    replica: 0.55,    // probabilidad de una segunda sacudida seguida
    microMin: 800,    // espera mínima entre micro-glitches
    microMax: 2200,   // espera máxima
    techoDur: 460,    // ningún glitch puede durar más que esto
  };

  const entre = (min, max) => min + Math.random() * (max - min);
  const signo = () => (Math.random() < 0.5 ? -1 : 1);
  const elegir = (n) => 1 + Math.floor(Math.random() * n);

  const VARIANTES = ["gv-1", "gv-2", "gv-3", "gv-4", "gv-5", "gv-6"];
  const MICRO_VARIANTES = ["mv-1", "mv-2", "mv-3"];
  const TODAS = ["is-glitching", "is-glitching-micro", ...VARIANTES, ...MICRO_VARIANTES];

  /* -----------------------------------------------------------------
     Estado central.
     Antes cada glitch creaba su propio setTimeout suelto: si se
     superponían, uno apagaba el glitch del otro a mitad de camino.
     Ahora hay UN solo temporizador de limpieza y se cancela antes de
     empezar el siguiente.
     ----------------------------------------------------------------- */
  let timerLimpieza = null;   // apaga el glitch actual
  let timerCiclo = null;      // programa el próximo
  let timerMicro = null;
  let inicioGlitch = 0;       // cuándo empezó (para el vigilante)
  let activo = true;

  function limpiarTodo() {
    cuerpo.classList.remove(...TODAS);
    inicioGlitch = 0;
  }

  function sortearForma(esMicro) {
    const s = cuerpo.style;
    const duracion = Math.min(
      CONFIG.techoDur,
      esMicro ? entre(90, 190) : entre(170, 420)
    );

    s.setProperty("--gx", `${entre(4, 22) * signo()}px`);
    s.setProperty("--gy", `${entre(1, 6) * signo()}px`);
    s.setProperty("--gskew", `${entre(0.2, 1.4) * signo()}deg`);
    s.setProperty("--gband", `${entre(8, 78)}%`);
    s.setProperty("--gbandh", `${entre(3, 16)}%`);
    s.setProperty("--gnoise", `${entre(0.25, 0.7)}`);
    s.setProperty("--ghue", `${entre(8, 45) * signo()}deg`);
    s.setProperty("--gsy", `${entre(0.97, 1.05)}`);
    s.setProperty("--gdur", `${Math.round(duracion)}ms`);

    return duracion;
  }

  function dispararFuerte() {
    if (!activo || document.hidden) return 0;

    clearTimeout(timerLimpieza);
    limpiarTodo();                       // siempre se arranca en limpio

    const duracion = sortearForma(false);
    cuerpo.classList.add(`gv-${elegir(6)}`, "is-glitching");
    inicioGlitch = performance.now();

    if (corromperBits) corromperBits(true);

    timerLimpieza = setTimeout(limpiarTodo, duracion);
    return duracion;
  }

  function dispararMicro() {
    if (!activo || document.hidden) return;
    if (cuerpo.classList.contains("is-glitching")) return;

    clearTimeout(timerLimpieza);
    cuerpo.classList.remove(...MICRO_VARIANTES);

    const duracion = sortearForma(true);
    cuerpo.classList.add(`mv-${elegir(3)}`, "is-glitching-micro");
    inicioGlitch = performance.now();

    if (corromperBits && Math.random() < 0.5) corromperBits(false);

    timerLimpieza = setTimeout(limpiarTodo, duracion);
  }

  function cicloFuerte() {
    timerCiclo = setTimeout(() => {
      const dur = dispararFuerte();

      if (dur && Math.random() < CONFIG.replica) {
        setTimeout(() => {
          dispararFuerte();
          if (Math.random() < 0.3) setTimeout(dispararFuerte, entre(90, 260));
        }, dur + entre(60, 380));
      }
      cicloFuerte();
    }, entre(CONFIG.fuerteMin, CONFIG.fuerteMax));
  }

  function cicloMicro() {
    timerMicro = setTimeout(() => {
      dispararMicro();
      cicloMicro();
    }, entre(CONFIG.microMin, CONFIG.microMax));
  }

  /* -----------------------------------------------------------------
     VIGILANTE (esto es lo que arregla el efecto congelado)
     -----------------------------------------------------------------
     Cuando la pestaña pasa a segundo plano, el navegador frena los
     setTimeout a uno por minuto. Si justo había un glitch activo, el
     temporizador que lo apaga no corre y la clase queda pegada: el
     efecto se ve trabado al volver.

     requestAnimationFrame NO corre en segundo plano, así que en cuanto
     la pestaña vuelve a estar visible este control se ejecuta y borra
     cualquier glitch que haya quedado colgado.
     ----------------------------------------------------------------- */
  function vigilar() {
    if (inicioGlitch && performance.now() - inicioGlitch > CONFIG.techoDur + 120) {
      clearTimeout(timerLimpieza);
      limpiarTodo();
    }
    requestAnimationFrame(vigilar);
  }
  requestAnimationFrame(vigilar);

  /* Parar del todo mientras no se ve, y reanudar limpio al volver */
  function parar() {
    activo = false;
    clearTimeout(timerLimpieza);
    clearTimeout(timerCiclo);
    clearTimeout(timerMicro);
    limpiarTodo();
    cuerpo.classList.add("is-paused");
  }
  function reanudar() {
    if (activo) return;
    activo = true;
    cuerpo.classList.remove("is-paused");
    limpiarTodo();
    cicloFuerte();
    cicloMicro();
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? parar() : reanudar();
  });
  window.addEventListener("pagehide", parar);
  window.addEventListener("pageshow", reanudar);

  activo = true;
  cicloFuerte();
  cicloMicro();
}

/* =================================================================
   INICIALIZACIÓN
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  try {
    arrancar();
  } catch (e) {
    // Si algo falla, al menos que se vea el contacto y no una página
    // en blanco (todo el contenido lo genera este script).
    console.error("Error al iniciar:", e);
    const c = document.getElementById("content");
    if (c && !c.children.length) {
      c.innerHTML =
        '<p style="text-align:center;color:#b3b9d1;padding:24px">' +
        'Something went wrong loading this page. ' +
        '<a style="color:#7cffb0" href="https://t.me/leonardoPhl">Message me on Telegram</a>.</p>';
    }
  }
});

function arrancar() {
  const contenido = document.getElementById("content");

  // El menú y las secciones salen del mismo array: el ORDEN del array
  // es el orden de las pestañas. Mové bloques para reordenar.
  crearNav(SECCIONES);

  SECCIONES.forEach((seccion) => {
    // El escalonado arranca de 0 en cada categoría: como solo se ve una
    // por vez, así ninguna tarda de más en aparecer.
    // Una sección puede tener `items` (tarjetas) o `pasos` (guía).
    if (seccion.pasos) {
      contenido.appendChild(crearGuia(seccion, 0));
    } else {
      contenido.appendChild(crearSeccion(seccion, 0));
    }
  });

  activarPersonalizacion();
  activarVisitantes();
  actualizarEstado();
  iniciarObservador();
  activarPestanas();
  // Si el visitante apagó los efectos, ni los creamos (ahorra batería)
  if (!document.body.classList.contains("no-fx")) {
    activarBits();
    activarGlitches();
  }

  // Abre la categoría del enlace (#guide) o, si no hay, la primera.
  mostrarSeccion(location.hash.slice(1));

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
