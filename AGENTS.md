# vendy.ltd: notes for agents

Static site (plain HTML/CSS/JS). Edit `src/`, run `python3 build.py`, commit `src/` and `dist/` together. Deploy is the manual **Deploy (FTP)** GitHub Action. See `README.md`.

## SEO rules (keep these true on every change)

- **Every page** (front matter in `src/pages/*.html`): unique `title` (about 50-60 chars, main keyword first, brand last) and unique `description` (about 140-160 chars). One `h1` per page.
- **Sitemap and robots are generated/static**: `sitemap.xml` is built from `src/pages/`, so never hand-edit it. `robots.txt` lives in `src/static/`.
- **Removing or renaming a page**: add a 301 in `src/static/.htaccess`, delete the old folder on the server (deploy never deletes), and fix internal links.
- **Images**: always `alt`, `width` and `height`. Use `loading="lazy"` below the fold only. The first visible hero image gets `fetchpriority="high"`, never `lazy`.
- **Structured data** lives in `src/partials/head.html` (LocalBusiness). Keep name, address and phone identical to `site.json` and the footer. Add `Product` schema only with real prices.
- **Do not put important text in iframes** (the Google Docs FAQs are not indexed as part of the page). New content goes in real HTML.
- **Performance**: keep CSS/JS small, no new third-party scripts above the fold, load YouTube only near the viewport. CSS/JS URLs are hash-versioned by `build.py`; do not remove `?v=`.
- **Do not write `name@domain`-looking text** that is not an email (Cloudflare rewrites it to `[email protected]`).
- After changing SEO-relevant files, rebuild and check: `curl -s https://vendy.ltd/sitemap.xml`, one `<title>`, one `<h1>`, a canonical, and no 404s in internal links.

## Google Docs on /resources/ (indexable text)

The FAQ pages embed published Google Docs in iframes, which search engines do not read as page text. `build.py` fetches each doc at build time and writes its text under the iframe as a collapsed "Read this document as text" section.

- The doc URLs live in `site.json` under `docs` (one place). The page uses `{{docs.<key>.url}}` and `{{doc_text.<key>}}`.
- Fetched text is cached in `data/doc-cache/*.json` and committed, so builds work offline (`VENDY_OFFLINE=1` skips the fetch). After the client edits a doc, run `python3 build.py` and commit the changed cache and `dist/`.
- To add a doc: add it to `site.json` `docs`, then use the same two placeholders in the page.
