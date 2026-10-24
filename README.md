# Leonardo B. — iOS portfolio

Static GitHub Pages website for Eagle, Coconut and Vendor. No build dependencies.

## Files

- `index.html`: accessible, usable without JavaScript; project snapshots, compatibility, installation guide and contact links.
- `styles.css`: responsive layouts, system light/dark theme, reduced-motion support, and 404 styles.
- `script.js`: theme toggle, navigation state, scroll reveal and live GitHub project data.
- `assets/`: local avatar, existing app artwork and font. Current Eagle and Coconut icons load from their official GitHub repositories.

## GitHub data

Each visit checks public repository metadata and all release pages, with a one-hour local cache. Version links select the newest published non-prerelease version-tagged release containing an IPA, falling back to a prerelease if necessary. Catalog-only releases are excluded from version selection. Download totals sum only `.ipa` assets across published releases, including older builds; they are download counts, not unique people or active users.

Failures and API rate limits retain the static October 24, 2026 snapshot for affected cards. The status line identifies partial failures. No credentials are required or embedded. Compatibility text is editorial and must be updated when the apps' supported ranges change.

## Privacy and CSP

No cookies, analytics, account system or form submissions. Theme and public-data cache use localStorage. Public release data comes from `api.github.com`; current app icons come from `raw.githubusercontent.com`. The avatar and font stay local. The CSP allows only those explicit external hosts for their respective resource types. Navigation sends no referrer.

The inline theme bootstrap is allowed by its SHA-256 hash in the CSP. Recompute that hash if its contents change. JSON-LD provides public profile metadata. GitHub Pages cannot set HTTP security headers; a meta CSP cannot enforce `frame-ancestors`.

## Deploy and verify

Publish the repository root from `main` through the existing GitHub Pages configuration; no framework or hosting migration is required. Update the CSS/JS query versions in `index.html` when those files change.

Verify local asset paths, section anchors, theme persistence, all three release links, details controls, mobile widths (320 and 390px), desktop layout, and GitHub API success/failure behavior. Preserve `404.html`, the manifest, robots and sitemap when editing.
