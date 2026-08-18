/* =================================================================
   Leonardo Baptiste — site behaviour
   -----------------------------------------------------------------
   All the page content lives in index.html, so the site works with
   JavaScript disabled. This file only adds polish: theme switching,
   nav highlighting and a scroll reveal.
   ================================================================= */

const SCHEME_KEY = "lb-scheme";

function readStored(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function store(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode: no harm */ }
}

/* -----------------------------------------------------------------
   LIGHT / DARK
   The inline script in <head> already applied any saved choice before
   first paint. This wires the button and keeps the browser chrome
   colour in step.
   ----------------------------------------------------------------- */
function setupScheme() {
  const root = document.documentElement;
  const button = document.getElementById("scheme");
  if (!button) return;

  function current() {
    const forced = root.getAttribute("data-scheme");
    if (forced === "light" || forced === "dark") return forced;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(scheme) {
    root.setAttribute("data-scheme", scheme);
    store(SCHEME_KEY, scheme);
    button.setAttribute(
      "aria-label",
      scheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );

    // The two <meta name="theme-color"> tags are media-scoped for the
    // system default; once a choice is forced they'd disagree with the
    // page, so drop them and set one explicit colour instead.
    const canvas = getComputedStyle(root).getPropertyValue("--canvas").trim();
    let meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = canvas;
  }

  button.addEventListener("click", () => {
    apply(current() === "dark" ? "light" : "dark");
  });
}

/* -----------------------------------------------------------------
   TOP BAR — hairline appears only once the page has scrolled, and the
   nav link for the section in view is highlighted.
   ----------------------------------------------------------------- */
function setupTopbar() {
  const bar = document.querySelector(".topbar");
  if (!bar) return;

  const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
}

function setupCurrentSection() {
  const links = [...document.querySelectorAll(".topnav a")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove("is-current"));
          link.classList.add("is-current");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* -----------------------------------------------------------------
   SCROLL REVEAL
   Cards fade up as they come into view. Anything already on screen at
   load stays visible, so nothing above the fold ever animates in late.
   ----------------------------------------------------------------- */
function setupReveal() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = document.querySelectorAll(".app, .repo, .clink, .step");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 }
  );

  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

function setupYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

setupScheme();
setupTopbar();
setupCurrentSection();
setupReveal();
setupYear();
