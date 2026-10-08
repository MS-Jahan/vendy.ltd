# vendy.ltd — WordPress → Static Site Migration Plan

**Date:** 2026-10-08 (rev 3 — all inputs resolved)
**Source:** local WordPress clone at `http://localhost:8090/` (docker-compose: `wordpress:php7.4-apache` + `mariadb:11.4`)
**Target:** plain static site — HTML + CSS + vanilla JS (jQuery only if a piece genuinely needs it). No React, no framework, no CMS.

> Note: `/home/sjs/Downloads/AGENTS.md` describes a different project (Manchitro Overseas / Next.js). It does **not** apply here.

---

## 0. Locked decisions (client, 2026-10-08)

| # | Decision |
|---|---|
| D1 | **Hosting: current cPanel (LiteSpeed)** host. Redirects via `.htaccess`. |
| D2 | **No contact form.** "Contact Us" buttons open a **Google Form** in a new tab. No backend, no CAPTCHA, no PHP. |
| D3 | **Shared header/footer via a tiny build script** (partials → `dist/`). Output is plain HTML. |
| D4 | **FAQ's + vending_details keep the embedded Google Docs.** Fix the iframes — currently unsized (browser default 300×150), so the doc is cut off and effectively not scrollable. |
| D5 | **Hero slider keeps the same slide images** (rebuilt as a light vanilla-JS slider). |
| D6 | **Content stays the same** — all text, products, prices, team, address, videos copied verbatim. |
| D7 | **New visual design.** Current Stockholm look is dropped entirely. Only the existing **images and text** carry over. |
| D8 | **Google Form URL = placeholder** `https://forms.gle/REPLACE_ME` in `site.json`. Client swaps it in later. |
| D9 | **Logo = current logo** from uploads (`VendyLogo`, `VendyLogo-square`, `vendyicon`). Palette sampled from it. |
| D10 | **Client deploys to cPanel themselves.** Deliverable = built `dist/` folder (+ zip) and a short README with deploy + edit steps. |

---

## 1. What exists today (audit findings)

### 1.1 Stack
| Item | Value | Notes |
|---|---|---|
| WordPress core | 4.9.26 | ~7 years old |
| PHP | 7.4 | EOL |
| Theme | `stockholm` (Select Themes), v4.1 | being dropped |
| Page builder | WPBakery `js_composer` 5.2 | content lives in shortcodes |
| Sliders | Revolution Slider (homepage), LayerSlider (installed) | known CVEs at these versions |
| Forms | Contact Form 7 + reCAPTCHA v2 | being replaced by Google Form link |
| Analytics | Google Tag Manager `GTM-PHM7XZV` | **keep** |
| Front-end weight | 21 stylesheets + 35 scripts on homepage | target: 1 CSS + 1 JS |
| Uploads | 188 MB | only ~87 files referenced by live pages |

### 1.2 Pages to migrate
Main menu: **Home · Products · About Us · Resources · Tutorials · FAQ's · Our Team · Contact Us**

| URL | WP id | Content | Special parts |
|---|---|---|---|
| `/` | 4 | Hero slider; **Products** (`#products`): FTu25 LC Folding Tray (৳35,000), HVu120 Spiral (৳60,000), HVu20 Spiral, HVu40/60 Spiral — key features, price, "Learn More" → `/vending_details/`; resources section (`#resouces`) | slider, anchors |
| `/about/` | 696 | About text | — |
| `/our-team/` | 698 | Team members (photo, name, role, bio) | team grid |
| `/contact-us/` | 694 | Address (Islambag, Satarkul, Uttor Badda, Dhaka 1212), `info@vendy.ltd`, `+880 1714-890252`, Google Map | CF7 form → **replaced by Google Form button** |
| `/faqs/` | 685 | Heading + Google Doc iframe `…/2PACX-1vRXhE-q8pz…/pub?embedded=true` | iframe fix |
| `/vending_details/` | 865 | Heading + Google Doc iframe `…/2PACX-1vQgxWEVvmJ…/pub?embedded=true` | iframe fix |
| `/tutorials/` | 683 | Step text + 3 YouTube videos (`1HD-lsE6JA0`, `TrdgfJmwOsA`, `0l2Mu6smr90`) | YouTube |

`/resouces/` (681) is empty; menu "Resources" points at `/#resouces` on the homepage.

### 1.3 Junk — do not migrate
- Pages: `/test/`, `/sample-page/`, `/home-test/`
- Posts: `hello-world` + 4 theme demo posts dated 2016-03-08
- WP attachment pages, feeds, `wp-json`, `xmlrpc.php`, comments, search
- Theme demo media (`start-up-parallax-*`, `blog-image-*`, `people_talking`, `custom-icon-*`, …) unless referenced

### 1.4 Security items found in webroot
- `vendyLtd27April.zip` (292 MB), `vendyLtd9April.zip` (295 MB), `images.zip`, `wp-content/ai1wm-backups/` — **if present on the live server they are publicly downloadable and likely contain the DB + `wp-config.php` credentials.** Move out of the public webroot immediately, independent of this migration.
- `favicon.ico` is 0 bytes — replace from logo.

---

## 2. Approach

1. Freeze the current site as a **reference** (mirror + screenshots + raw content export). Used only to source text and images.
2. Design a **new visual system** (§3).
3. Hand-write lean semantic HTML per page using partials + build script; one `main.css`, one `main.js`.
4. Keep every URL identical (folder-per-page, trailing slash); 301 the rest.
5. Swap WordPress for `dist/` on cPanel.

### 2.1 Repo structure
```
vendy-static/
├── src/
│   ├── partials/
│   │   ├── head.html          ← meta, fonts, CSS, GTM (with {{title}}, {{description}}, {{canonical}} placeholders)
│   │   ├── header.html        ← logo + nav (active link via {{nav_<page>}} flag)
│   │   └── footer.html        ← address, phone, email, Contact button, ©
│   ├── pages/
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── our-team.html
│   │   ├── contact-us.html
│   │   ├── faqs.html
│   │   ├── vending_details.html
│   │   ├── tutorials.html
│   │   └── 404.html
│   └── static/                ← copied as-is
│       ├── assets/css/main.css
│       ├── assets/js/main.js
│       ├── assets/img/…
│       ├── assets/fonts/…     (if self-hosted)
│       ├── favicon.ico, favicon.svg, apple-touch-icon.png
│       ├── robots.txt
│       ├── sitemap.xml
│       └── .htaccess
├── build.py                   ← ~40 lines, stdlib only
├── reference/                 ← frozen WP mirror + screenshots (not deployed)
└── dist/                      ← build output, what gets uploaded
```

### 2.2 Build script (`build.py`)
- Python stdlib only, no dependencies; run via `docker run --rm -v "$PWD:/w" -w /w python:3.12-alpine python build.py`.
- Each page file starts with a small front-matter block:
  ```
  <!--
  title: About Us — Vendy Ltd
  description: …
  path: /about/
  nav: about
  -->
  ```
- Script: read front-matter → inject `head` / `header` / `footer` partials → replace placeholders → write `dist/<path>/index.html` (homepage → `dist/index.html`, 404 → `dist/404.html`) → copy `src/static/` → `dist/`.
- Also generates `sitemap.xml` from page `path`s (so it never drifts).
- Google Form URL, phone, email, GTM id live in one `site.json` config read by the script → placeholders `{{form_url}}`, `{{phone}}`, etc. Change once, rebuild.

---

## 3. New design

Only **images and text** carry over. Everything visual is new.

### 3.1 Direction
Vendy builds vending machines locally in Bangladesh — IoT-enabled, MFS/RFID payment, hygiene products. Design should read as **a local hardware/engineering company**: clean, confident, product-first, technical but approachable. Not a generic startup template.

- **Product-first:** machine photos are the hero of the site. Large, on calm backgrounds, with spec-style labels.
- **Engineering feel:** spec tables / key-feature lists styled like datasheets (model code, capacity, payment methods, price as clear data).
- **Warm & local:** real team photos and real deployment photos (office, factory, "Vendy being built" banner) given space — trust matters.

### 3.2 Colour
- Sample the actual **Vendy logo** (`vendylogo`, `VendyLogo-square`) and derive the primary from it.
- Structure: neutral base (warm off-white + deep ink), **one** brand primary for links/headings/structure, **one** accent for CTAs (Contact button, Learn More) only. Roughly 60 / 30 / 10.
- No purple/blue-pink gradients, no glassmorphism, no blurred blobs.
- All text/background pairs verified WCAG AA (4.5:1 body, 3:1 large).
- Tokens as CSS custom properties in `:root` (`--color-bg`, `--color-ink`, `--color-primary`, `--color-accent`, `--radius`, `--shadow`, spacing scale).

### 3.3 Typography
- Drop Raleway / Crete Round / all-weights loading.
- One characterful sans for headings (e.g. Space Grotesk / Manrope / General Sans) + a readable body sans; **max 3 weights total**. Self-host woff2 with `font-display: swap`, preload the heading weight.
- Must render Bangla `৳` and any Bangla text correctly (add Hind Siliguri / Noto Sans Bengali subset only if Bangla text exists in content).
- Fluid type scale with `clamp()`.

### 3.4 Layout
- Mobile-first (design 375px first), max content width ~1200px.
- Sticky slim header; mobile hamburger → full-height panel. Header CTA button: **Contact Us** (Google Form).
- Avoid "everything centred" and uniform 3-icon rows; use asymmetric splits (image + text) and varied section backgrounds (light / tinted / dark) for rhythm.
- Touch targets ≥ 44px; visible `:focus-visible` rings.

### 3.5 Page designs
| Page | Layout |
|---|---|
| **Home** | (1) Hero slider — same slide images, full-bleed with overlay headline + 2 CTAs (*View Products* → `#products`, *Contact Us* → Google Form). (2) Short intro strip (from About text). (3) **Products** — 4 product cards: image, model code as badge, name, key features as compact spec list, price prominent, "Learn More" → `/vending_details/`. Card hover: lift + shadow. (4) **Resources** anchor section (`id="resources"` + legacy `id="resouces"`) — links to Tutorials / FAQ's / Vending details. (5) Contact CTA band (dark) — phone, email, Contact button. |
| **About** | Two-column: text left, deployment/build photo right; key points pulled out as highlighted statements. |
| **Our Team** | Founder featured larger (photo + bio), rest in responsive grid (square photo, name, role, bio). |
| **Tutorials** | Each tutorial = step list (numbered, styled) + video. Videos as click-to-load facades. |
| **FAQ's / vending_details** | Page header + full-width embedded Google Doc in a styled frame (§5.2). |
| **Contact Us** | Split: left = address, phone (`tel:`), email (`mailto:`), big **"Send us a message"** button → Google Form; right = lazy Google Map. |
| **404** | Branded, links to Home / Products / Contact. |

### 3.6 Motion
- CSS only except slider: fade-in-up on scroll via `IntersectionObserver` (once), card hover lift, button hover.
- `prefers-reduced-motion: reduce` → slider stops autoplay, no reveals.
- Animate `transform`/`opacity` only.

---

## 4. Phases & tasks

### Phase 0 — Freeze reference
- [ ] Mirror local WP into `reference/mirror/` via wget in docker:
      `docker run --rm --network host -v "$PWD/reference:/out" alpine sh -c "apk add wget && wget --mirror --page-requisites --adjust-extension --convert-links --no-parent -e robots=off -P /out/mirror http://localhost:8090/"`
- [ ] Screenshots of all 7 pages at 375 / 1440 (Playwright docker) → `reference/screenshots/` (content check only, not a design target).
- [ ] Export page content via REST `/wp-json/wp/v2/pages/<id>` → `reference/content/<slug>.json`.
- [ ] Export Rev Slider slides (image paths + any captions) from `wp_revslider_slides`.
- [ ] List every referenced upload (≈87) → `reference/used-images.txt`.
- [ ] Note any Bangla text in content (affects font choice).

### Phase 1 — Design system + skeleton
- [ ] Sample logo colours; define tokens (§3.2); verify contrast pairs.
- [ ] Pick + self-host fonts (§3.3).
- [ ] `main.css`: reset, tokens, type scale, container/grid, buttons (primary / outline / CTA), cards, badges, spec list, section variants (light / tinted / dark), iframe/video frame.
- [ ] `site.json` (form URL, phone, email, address, GTM id, site URL).
- [ ] `build.py` + partials (`head`, `header`, `footer`).
- [ ] Header: logo, nav (Home · Products `/#products` · About Us · Resources `/#resources` · Tutorials · FAQ's · Our Team · Contact Us), Contact CTA button, mobile menu (vanilla JS, `aria-expanded`, works as plain links without JS).
- [ ] Footer: logo, address, `tel:` / `mailto:` links, quick links, Contact button, ©.
- [ ] GTM `GTM-PHM7XZV` head snippet + `<noscript>` body iframe.

### Phase 2 — Homepage
- [ ] Hero slider: same slide images; vanilla JS (~40 lines) — fade, autoplay 5s, pause on hover/focus, prev/next + dots (buttons with `aria-label`), swipe on touch; first slide plain `<img fetchpriority="high">` for LCP; other slides lazy.
- [ ] Intro strip, Products (4 cards, verbatim content), Resources section, Contact CTA band.

### Phase 3 — Inner pages
- [ ] About, Our Team, Tutorials, FAQ's, vending_details, Contact Us, 404 per §3.5.
- [ ] YouTube facade: thumbnail `https://i.ytimg.com/vi/<id>/hqdefault.jpg` + play button; on click inject `https://www.youtube-nocookie.com/embed/<id>?autoplay=1`; without JS the thumbnail links to `youtube.com/watch?v=<id>`.

### Phase 4 — Assets
- [ ] Copy only referenced images (≈87) from `wp-content/uploads`.
- [ ] Resize (hero 1920w + 1280w + 768w, cards 800w, team 480w) and encode WebP + JPEG fallback via `<picture>`/`srcset` — in docker (`dpokidov/imagemagick` or `cwebp`).
- [ ] Every `<img>`: `width`, `height`, `alt`, `loading="lazy"` (except hero), `decoding="async"`.
- [ ] Favicon set + OG image from logo.

### Phase 5 — Google Form contact (replaces CF7)
- [ ] `site.json` → `"form_url": "https://forms.gle/REPLACE_ME"` (placeholder, D8).
- [ ] Client later: create Google Form (Name, Email/Phone, Subject, Message), enable response email notifications, paste URL into `site.json`, rebuild.
- [ ] All Contact buttons: `<a href="{{form_url}}" target="_blank" rel="noopener" class="btn btn-cta">Contact Us</a>` — header, home CTA band, contact page, footer.
- [ ] Contact page still shows phone, email, address, map as direct alternatives.
- [ ] GTM: click event on `.btn-cta` → `contact_form_click` (configure trigger in GTM UI, no code beyond a `data-track` attribute).
- [ ] Remove reCAPTCHA entirely.

### Phase 6 — SEO & URL preservation
- [ ] Unique `<title>` + `<meta name="description">` per page (current homepage title is `Vendy Ltd | ` — fix).
- [ ] Canonical (`https://vendy.ltd/...`), Open Graph + Twitter tags.
- [ ] JSON-LD `Organization` + `LocalBusiness` (name, address, phone, email, geo 23.7833 / 90.3923) in head partial.
- [ ] `sitemap.xml` (auto from build) + `robots.txt`.
- [ ] `.htaccess` (§6).

### Phase 7 — Test (docker)
- [ ] Serve `dist/` via `httpd:2.4-alpine` with `AllowOverride All` + `mod_rewrite` on `:8091` → tests `.htaccess` the same way cPanel will.
- [ ] Link check: `lycheeverse/lychee` over `dist/`.
- [ ] HTML validation: `ghcr.io/validator/validator`.
- [ ] Lighthouse mobile ≥ 90 all categories.
- [ ] Redirect test: curl every old URL in §6 against `:8091`.
- [ ] Content diff: every text block from `reference/content/*.json` present in `dist/` (script check).
- [ ] FAQ iframes: full doc readable & scrollable on mobile and desktop.
- [ ] Contact buttons open the Google Form in a new tab.
- [ ] No-JS: nav, content, phone/email/form links all work.
- [ ] Real Android phone on mobile data.

### Phase 8 — Handover + launch on cPanel (client-run, D10)
- [ ] Deliver `dist/` + `vendy-static-dist.zip` + `README.md` (how to: change form URL / phone / email in `site.json`, rebuild with docker command, upload to `public_html`).
- [ ] README includes the launch checklist below for the client:
- [ ] Full backup of live WP (files + DB) downloaded **off** the server.
- [ ] Move backup zips + `ai1wm-backups` out of public webroot.
- [ ] Move WP files into a non-public folder (e.g. `~/wp-archive/`) — keep ≥ 3 months, then delete. Keep DB (don't drop) for same period.
- [ ] Upload `dist/` contents to `public_html` (File Manager zip upload or FTP/SFTP).
- [ ] Disable LiteSpeed Cache WP rules (gone with WP); purge LiteSpeed cache in cPanel.
- [ ] Force HTTPS + `www` → apex in `.htaccess`.
- [ ] Search Console: submit sitemap, monitor 404s for 2–4 weeks; confirm GTM fires.

---

## 5. Component details

### 5.1 Google Form contact
Pros: zero backend, no spam handling, responses land in Google Sheets, client already uses Google.
Cons: user leaves the site (mitigated with new tab), Google branding on form. Acceptable.

### 5.2 Google Doc embeds (fix "not scrollable")
Cause: iframes have no `width`/`height` → render ~300×150, doc cut off. Cross-origin, so auto-height via JS is impossible.

Fix:
```html
<div class="doc-frame">
  <iframe src="https://docs.google.com/document/d/e/<id>/pub?embedded=true"
          title="Vendy FAQ" loading="lazy"></iframe>
</div>
<p><a href="https://docs.google.com/document/d/e/<id>/pub" target="_blank" rel="noopener">Open full document ↗</a></p>
```
```css
.doc-frame { border: 1px solid var(--color-line); border-radius: var(--radius); overflow: hidden; background: #fff; }
.doc-frame iframe { display: block; width: 100%; height: min(80vh, 900px); border: 0; }
@media (max-width: 640px) { .doc-frame iframe { height: 75vh; } }
```
Iframe scrolls internally; "Open full document" link as fallback on small screens. Client keeps editing the Docs as today.

### 5.3 Hero slider
Same Rev Slider images; captions only if they exist in the export. No library.

### 5.4 jQuery
Not needed — everything (menu, slider, reveals, YouTube facade) is small vanilla JS. Revisit only if a new need appears.

---

## 6. URL map + `.htaccess`
| Old | New | Status |
|---|---|---|
| `/`, `/about/`, `/our-team/`, `/contact-us/`, `/faqs/`, `/vending_details/`, `/tutorials/` | same | 200 |
| `/resouces/` | `/#resources` | 301 |
| `/test/`, `/home-test/`, `/sample-page/`, `/home-main/` | `/` | 301 |
| `/2016/…`, `/2018/…` posts, `/category/…`, `/author/…` | `/` | 301 |
| attachment pages `/home-main/*/`, `/our-team/*/` | parent | 301 |
| `/?page_id=694` etc. | matching page | 301 |
| `/feed/`, `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/` | — | 410 |

```apache
ErrorDocument 404 /404.html
RewriteEngine On
# HTTPS + apex
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^ https://vendy.ltd%{REQUEST_URI} [R=301,L]
# old WP
RewriteRule ^resouces/?$ /#resources [R=301,NE,L]
RewriteRule ^(test|home-test|sample-page|home-main)/?$ / [R=301,L]
RewriteRule ^(20[0-9]{2})/ / [R=301,L]
RewriteRule ^(category|author|tag)/ / [R=301,L]
RewriteRule ^home-main/[^/]+/?$ / [R=301,L]
RewriteRule ^our-team/[^/]+/?$ /our-team/ [R=301,L]
RewriteCond %{QUERY_STRING} (^|&)page_id=694(&|$)
RewriteRule ^$ /contact-us/? [R=301,L]
# (… one block per page id: 696 about, 698 our-team, 685 faqs, 683 tutorials, 865 vending_details)
RewriteRule ^(feed|comments/feed|wp-admin|wp-login\.php|xmlrpc\.php|wp-json)(/|$) - [G,L]
# caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```
Long cache on CSS/JS → build script appends content hash to filenames (`main.3f9a.css`) or `?v=<hash>`.

---

## 7. Effort estimate
| Phase | Est. |
|---|---|
| 0 Reference | 0.5 day |
| 1 Design system + skeleton + build script | 1.5 days |
| 2 Homepage | 1 day |
| 3 Inner pages | 1 day |
| 4 Assets | 0.5 day |
| 5 Google Form wiring | 0.1 day (+ client creates form) |
| 6 SEO + `.htaccess` | 0.5 day |
| 7 Testing | 0.5–1 day |
| 8 Launch | 0.5 day |
| **Total** | **~6 working days** |

---

## 8. Remaining inputs
None blocking. Placeholder form URL (D8), current logo (D9), client handles deploy (D10).
Design checkpoint: homepage built first and shown for approval before inner pages.
