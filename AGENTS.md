# vendy.ltd: notes for agents

Static site (plain HTML/CSS/JS). Edit `src/`, run `python3 build.py`, commit `src/` and `dist/` together. Deploy is the manual **Deploy (FTP)** GitHub Action. See `README.md`.

## SEO rules (keep these true on every change)

- **Every page** (front matter in `src/pages/*.html`): unique `title` (about 50-60 chars, main keyword first, brand last) and unique `description` (about 140-160 chars). One `h1` per page.
- **Sitemap and robots are generated/static**: `sitemap.xml` is built from `src/pages/`, so never hand-edit it. `robots.txt` lives in `src/static/`.
- **Removing or renaming a page**: add a 301 in `src/static/.htaccess`, delete the old folder on the server (deploy never deletes), and fix internal links.
- **Images**: always `alt`, `width` and `height`. Use `loading="lazy"` below the fold only. The first visible hero image gets `fetchpriority="high"`, never `lazy`.
- **Structured data is generated**, never typed into templates. See "Single source of truth" below.
- **Do not put important text in iframes** (the Google Docs FAQs are not indexed as part of the page). New content goes in real HTML.
- **Performance**: keep CSS/JS small, no new third-party scripts above the fold, load YouTube only near the viewport. CSS/JS URLs are hash-versioned by `build.py`; do not remove `?v=`.
- **Do not write `name@domain`-looking text** that is not an email (Cloudflare rewrites it to `[email protected]`).
- After changing SEO-relevant files, rebuild and check: `curl -s https://vendy.ltd/sitemap.xml`, one `<title>`, one `<h1>`, a canonical, and no 404s in internal links.

## Google Docs on /resources/ (indexable text)

The FAQ pages embed published Google Docs in iframes, which search engines do not read as page text. `build.py` fetches each doc at build time and writes its text under the iframe as a collapsed "Read this document as text" section.

- The doc URLs live in `site.json` under `docs` (one place). The page uses `{{docs.<key>.url}}` and `{{doc_text.<key>}}`.
- Fetched text is cached in `data/doc-cache/*.json` and committed, so builds work offline (`VENDY_OFFLINE=1` skips the fetch). After the client edits a doc, run `python3 build.py` and commit the changed cache and `dist/`.
- To add a doc: add it to `site.json` `docs`, then use the same two placeholders in the page.

## Single source of truth: `site.json`

Business facts, SEO data and prices live in `site.json` only. `build.py` turns nested keys into dotted placeholders (`{{products.ftu25.price_display}}`, `{{docs.faqs.url}}`) and generates all JSON-LD (`jsonld_for()` in `build.py`) and the share-image tags. **Change a value in `site.json`, rebuild, commit `dist/`. Never retype a price, hour, phone, address or URL in a page or partial.**

| To change | Edit in `site.json` | What updates |
|---|---|---|
| A product price | `products.<id>.price` (a number, in BDT) | Home + Products text, Products table, `Product`/`Offer` schema, `priceRange`, the Products meta description |
| Product name, image, description, SKU | `products.<id>` | `Product` schema (page text is still in `src/pages/products.html`) |
| Add a product | new key under `products`, plus its card in `products.html` | schema, price range |
| Opening hours | `hours` (list of `days`, `opens`, `closes`, 24h) | `openingHoursSpecification`. Current value is an assumption (Sun-Thu 09:00-17:00); confirm with the client |
| Social profiles | `social` (name: URL) | `sameAs` |
| Phone, email, address, map, geo | top-level keys and `address_parts` | footer, contact page, `LocalBusiness`, `ContactPoint` |
| Logo for Google | `logo` (square, at least 112x112) | `LocalBusiness.logo` |
| Share image | `og_image` (path, size, alt) | `og:image`, `twitter:image` |
| Contact form | `form_url` | every "Send a message" button |

Notes:
- Each page's front matter needs `title`, `description`, `path` and, for inner pages, `breadcrumb` (feeds `BreadcrumbList`). Front matter may use placeholders (the Products description uses `{{price_min}}` and `{{price_max}}`).
- The share image `src/static/assets/img/og-image.jpg` (1200x630) is a static file. To rebuild it: `ffmpeg -f lavfi -i color=c=white:s=1200x630 -i src/static/icon-192.png -i <product1> -i <product2> -/filter_complex tools/og-image.filter -map "[o]" -frames:v 1 -q:v 3 og-image.jpg` (inputs in that order; fonts are Noto Sans).
- **Machines are listed cheapest first** (Home lineup, Products lineup, model tabs, detail sheets, compare table, schema). The `01..04` numbers follow that order, and the first model is the default one shown on the Products page. `build.py` fails with a clear message if a price change breaks the order: then reorder the blocks in `index.html` / `products.html` and renumber.
- Only mark up what is true and visible on the site. Do not add `AggregateRating`, reviews, or stock claims without real data.
