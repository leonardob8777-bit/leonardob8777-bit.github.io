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
     offline → rojo    (caído / certificado vencido)
     soon    → ámbar   (próximamente)

   CÓMO AGREGAR UNA SECCIÓN NUEVA
   Copiá un bloque de SECCIONES entero (con su id, titulo, etc.).
   El menú de categorías de arriba se actualiza solo.
   ================================================================= */

const SECCIONES = [
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
        nota: "Free version — needs a valid certificate to open.",
      },
      {
        id: "ksign",
        titulo: "KSign",
        subtitulo: "IPA signer for iOS",
        // 👇 CAMBIAR cuando tengas un enlace de instalación nuevo.
        url: "#guide",
        icono: "ksign",
        tipo: "interno",
        estado: "soon",
        nota: "Setup guide below.",
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
    descripcion: "What you need so the apps actually open.",
    items: [
      {
        id: "certificados",
        titulo: "Download Certificates",
        subtitulo: "MediaFire folder",
        url: "https://www.mediafire.com/folder/tfyqtjugh0jtv/Certificate",
        icono: "mediafire",
        tipo: "externo",
        estado: "online",
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
    descripcion: "Useful utilities before you install anything.",
    items: [
      {
        id: "udid",
        titulo: "Get UDID",
        subtitulo: "Find your device ID",
        url: "https://udid.tech/",
        icono: "getudid",
        tipo: "externo",
        estado: "online",
        nota: "You need this to buy a certificate.",
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
    descripcion: "Questions, certificates or custom requests.",
    items: [
      {
        id: "telegram",
        titulo: "Telegram",
        subtitulo: "If you need help, text me",
        url: "https://t.me/leonardoPhl",
        icono: "telegram",
        tipo: "externo",
        estado: "online",
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
    titulo: "After installing KSign",
    descripcion: "Follow these steps in order. It takes about 3 minutes.",
    pasos: [
      {
        titulo: "Trust the app",
        detalle:
          "Go to <b>Settings → General → VPN & Device Management</b>, tap the developer profile and press <b>Trust</b>.",
      },
      {
        titulo: "Get your UDID",
        detalle:
          "Open the <b>Get UDID</b> tool in Tools and copy your device ID. You need it to buy a certificate.",
      },
      {
        titulo: "Get a certificate",
        detalle:
          "Send me your UDID on <b>Telegram</b> and I'll set you up with a certificate that lasts up to a year.",
      },
      {
        titulo: "Import the certificate into KSign",
        detalle:
          "Open KSign → <b>Certificates</b> → import the <b>.p12</b> file and the <b>.mobileprovision</b>, then type the password you were given.",
      },
      {
        titulo: "Sign and install your IPA",
        detalle:
          "In KSign, pick the IPA, choose your certificate and tap <b>Sign</b>. When it finishes, tap <b>Install</b>.",
      },
      {
        titulo: "Done",
        detalle:
          "The app now opens normally. If it stops working, the certificate was revoked — message me and I'll replace it.",
      },
    ],
  },

  /* ---------------------------------------------------------------
     LIVE  (última categoría — se muestra en rojo en el menú)
     --------------------------------------------------------------- */
  {
    id: "live",
    nav: "Live",
    acento: "live", // pinta la pestaña de rojo con puntito latiendo
    titulo: "Live",
    descripcion: "Anti-revoke DNS profile — keeps signed apps working.",
    items: [
      {
        id: "dns-profile",
        titulo: "Install DNS Profile",
        subtitulo: "Anti-revoke · iOS",
        url: "profiles/anti-revoke.mobileconfig",
        icono: "shield",
        tipo: "perfil",
        estado: "live",
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

/* Texto que se muestra al lado del puntito de estado de cada tarjeta */
const ETIQUETA_ESTADO = {
  online: "Online",
  offline: "Down",
  soon: "Soon",
  live: "Live", // rojo, con latido
};

/* =================================================================
   RENDERIZADO — de acá para abajo no hace falta tocar nada
   ================================================================= */

/** Crea una tarjeta (un <a>) a partir de un item. */
function crearTarjeta(item, indice) {
  const a = document.createElement("a");
  a.href = item.url;
  a.className = "link reveal";
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

  a.innerHTML = `
    <span class="link__shine" aria-hidden="true"></span>
    <span class="link__row">
      <span class="link__icon">${icono}</span>
      <span class="link__text">
        <span class="link__title">${item.titulo}${estado}</span>
        ${subtitulo}
      </span>
      ${ARROW_ICON}
    </span>
    ${nota}
  `;

  return a;
}

/** Crea una sección completa con su título y sus tarjetas. */
function crearSeccion(seccion, contadorInicial) {
  const sec = document.createElement("section");
  sec.className = "section";
  sec.id = seccion.id;

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

    ev.preventDefault();
    mostrarSeccion(id);
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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

/* =================================================================
   INICIALIZACIÓN
   ================================================================= */
document.addEventListener("DOMContentLoaded", () => {
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

  actualizarEstado();
  iniciarObservador();
  activarPestanas();

  // Abre la categoría del enlace (#guide) o, si no hay, la primera.
  mostrarSeccion(location.hash.slice(1));

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
