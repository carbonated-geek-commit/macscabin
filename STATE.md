# MACS Cushman Cabin — Project State & Handoff

Redesign of https://www.macscushmancabin.com/ (migrating off Google Sites).
Built 2026-07-14 following the shared Web Design & Engineering Standards.

## Architecture

- **Eleventy 3 + Nunjucks**, hand-written CSS (design tokens in `src/assets/css/main.css` `:root`), one small deferred vanilla JS file (`src/assets/js/main.js`: nav toggle, lightbox, delegated `data-analytics` listener).
- **Content lives in `src/_data/*.json`** — templates are dumb. Pages: home, gallery, the-cabin, area-guide, faqs, about, book, contact, 404.
- **Images**: 112 photos rescued from the Google Sites CDN (signed URLs there expire within minutes — they were re-fetched page-by-page and downloaded immediately). Converted to WebP q85, bounded 1600px, in `src/assets/images/`. `tools/optimize-images.js` was the one-time importer (reads `.firecrawl/images`, which is gitignored scratch).
- **CSS/JS cache-busting**: `assetHash` filter appends a content hash (`?v=`).
- **Path prefix**: `HtmlBasePlugin` + `PATH_PREFIX` env. CI computes `/repo-name/` until the repo variable `CUSTOM_DOMAIN=true` is set, then `/`.

## Data ownership

- All `src/_data/*.json` are **human-owned, edited via the CMS** (`/admin/`), except `navigation.json` which is **developer-owned** and intentionally not in the CMS.
- No machine-owned/ETL files yet. If a sync is ever added, give it its own file and never let the CMS touch it.

## CMS (Sveltia) — NOT YET LIVE

`src/admin/config.yml` mirrors the JSON model with full field coverage (verified by a leaf-path coverage script — every JSON leaf has a field; an unmodeled key would be silently deleted on save). Remaining setup once the GitHub repo exists:

1. Set `backend.repo` in `src/admin/config.yml`.
2. Create a GitHub OAuth app; deploy the `sveltia-cms-auth` Cloudflare Worker; set `base_url` in the config.
3. Tell editors: after any config change deploys, **reload `/admin/`** before editing (stale tab writes the old shape).

Media library is configured to auto-convert uploads to WebP q85 / 1600px and slugify filenames.

## Deployment — NOT YET LIVE

- `.github/workflows/deploy.yml`: deploy on push to main + `workflow_dispatch` + weekly cron (Mon 11:23 UTC) + `workflow_call` (so a future sync can chain it — a `GITHUB_TOKEN` push from another workflow will not trigger `on: push`).
- To go live: create the GitHub repo, push, enable Pages with **GitHub Actions** source. Then point the `macscushmancabin.com` DNS at Pages, add the custom domain in repo settings, and set repo variable `CUSTOM_DOMAIN=true`.
- The old Google Site should be retired only after the domain cutover.

## Open threads / decisions made on the owner's behalf (confirm with owner)

- **Minimum age discrepancy**: old site said 25 on the home page ("2 5" typo included) but 21 on the About page. Standardized on **25** everywhere. Confirm.
- **IA change**: "Pictures" → "Gallery"; "Local Attractions" → "Area Guide"; "Book a Reservation" → "Book"; "Inquiry" page folded into Contact (links to the same Google Form). Old Google-Sites URLs (/pictures, /local-attractions, /book-a-reservation, /inquiry) should get redirects if the host allows, or at least the 404 page covers them.
- **Availability calendar**: kept the existing public Google Calendar embed (an import calendar fed by Vrbo) on /book/. Account-neutral enough, but a direct Vrbo ics or widget would be cleaner.
- **Analytics**: `site.analyticsId` is empty → no tag is emitted. Fill it to enable GA4 (privacy-flags already configured; events wired: nav/hero/cta book clicks, vrbo_outbound_click, inquiry_form_click, social_click).
- **Copy**: hero heading, card titles, and section copy are new (the old site's copy was reused where it existed). Owner should review tone.
- Attraction card images were re-assigned by eye because Google Sites' DOM put images ± one section off; a few attractions (Bear Gulch, North Fork Trailhead, Division 3 Park) have no photo — the card shows a designed empty state. Real photos welcome via CMS.

## Traps (project-specific)

- `.firecrawl/` holds the raw scrape + original images — scratch, gitignored, but KEEP the originals until the site is live (source of truth for photos).
- The nav "Book Your Stay" button needed `.nav a.btn--primary` specificity overrides — `.nav a` color rules will silently win over `.btn--primary` for any new button placed in the nav.
- Screenshot capture in the Claude browser pane timed out on this machine; headless Chrome (`chrome.exe --headless=new --screenshot=...`) works (forward slashes in the output path).

## Verify before shipping changes

`npx eleventy --serve --port=8087`, then: no horizontal scroll at 300px, hamburger `aria-expanded` toggles, lightbox opens/closes, contrast script pairs still pass (script in the session scratchpad; pairs listed in STATE history), `target="_blank"` always paired with `rel="noopener"`.
