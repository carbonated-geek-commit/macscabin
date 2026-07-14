# MACS Cushman Cabin

Static site for the MACS Cushman Cabin vacation rental — Hoodsport, WA, on Lake Cushman.
Eleventy + hand-written CSS + Git-backed CMS. No database, no server, ~$0/month.

## Develop

```bash
npm install
npm run serve   # http://localhost:8080
npm run build   # outputs to _site/
```

## Edit content

All page content lives in `src/_data/*.json`. Once the CMS is set up (see STATE.md), non-developers edit at `/admin/`.

## Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages (also rebuilds weekly). See `STATE.md` for full architecture, ownership rules, and go-live steps.
