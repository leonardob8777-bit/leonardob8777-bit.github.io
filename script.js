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


/* Public GitHub data, with a useful static snapshot if requests fail.
   No token, visitor tracking, cookies or background timers. */
const GITHUB_OWNER = "leonardob8777-bit";
const STATS_CACHE_KEY = "lb-projects-v1";
const STATS_TTL = 60 * 60 * 1000;

async function githubJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error("GitHub data unavailable");
    return await response.json();
  } finally { clearTimeout(timeout); }
}

async function getProjectData(name) {
  const base = `https://api.github.com/repos/${GITHUB_OWNER}/${name}`;
  const metadata = await githubJSON(base);
  const releases = [];
  // Follow all pages: Coconut also publishes wallpaper/catalog releases.
  for (let page = 1; ; page++) {
    if (page > 30) throw new Error("Release list incomplete");
    const batch = await githubJSON(`${base}/releases?per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error("Invalid release list");
    releases.push(...batch.filter(release => !release.draft));
    if (batch.length < 100) break;
  }
  const appReleases = releases.filter(release => /^v?\d+\.\d+/i.test(release.tag_name) && release.assets?.some(asset => /\.ipa$/i.test(asset.name)));
  appReleases.sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  const release = appReleases.find(item => !item.prerelease) || appReleases[0];
  if (!release || !Number.isFinite(metadata.stargazers_count)) throw new Error("Incomplete project data");
  return {
    name, version: release.tag_name,
    // Construct only known GitHub paths; API text never becomes HTML.
    releaseURL: `https://github.com/${GITHUB_OWNER}/${name}/releases/tag/${encodeURIComponent(release.tag_name)}`,
    stars: metadata.stargazers_count,
    downloads: releases.flatMap(item => item.assets || []).filter(asset => /\.ipa$/i.test(asset.name)).reduce((sum, asset) => sum + (Number(asset.download_count) || 0), 0),
    checkedAt: Date.now()
  };
}

function renderProjectData(data) {
  const card = [...document.querySelectorAll("[data-project]")].find(item => item.dataset.project === data.name);
  if (!card) return;
  const version = card.querySelector("[data-version]");
  version.textContent = data.version;
  version.href = data.releaseURL;
  card.querySelector("[data-release]").href = data.releaseURL;
  card.querySelector("[data-downloads]").textContent = `${data.downloads.toLocaleString("en-US")} IPA downloads`;
  card.querySelector("[data-stars]").textContent = `${data.stars.toLocaleString("en-US")} stars ↗`;
}

async function setupProjectUpdates() {
  const status = document.getElementById("data-status");
  if (!status) return;
  const names = [...document.querySelectorAll("[data-project]")].map(card => card.dataset.project);
  let cached = {};
  try { cached = JSON.parse(readStored(STATS_CACHE_KEY)) || {}; } catch { /* use snapshot */ }
  const results = await Promise.allSettled(names.map(async name => {
    const saved = cached[name];
    const valid = saved && saved.name === name && Number.isFinite(saved.checkedAt) && saved.checkedAt <= Date.now() && Date.now() - saved.checkedAt < STATS_TTL && Number.isFinite(saved.downloads) && Number.isFinite(saved.stars) && typeof saved.version === "string" && saved.releaseURL === `https://github.com/${GITHUB_OWNER}/${name}/releases/tag/${encodeURIComponent(saved.version)}`;
    const data = valid ? saved : await getProjectData(name);
    renderProjectData(data);
    cached[name] = data;
    return data;
  }));
  store(STATS_CACHE_KEY, JSON.stringify(cached));
  const complete = results.every(result => result.status === "fulfilled");
  const checked = results.filter(result => result.status === "fulfilled").map(result => result.value.checkedAt);
  if (complete) {
    const date = new Date(Math.min(...checked));
    status.textContent = `GitHub data checked ${date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}. Refreshes on visits, cached up to one hour.`;
  } else {
    status.textContent = "Some live GitHub data is unavailable. Unchanged cards show the October 24, 2026 snapshot; open releases for current totals.";
  }
}
setupProjectUpdates();
