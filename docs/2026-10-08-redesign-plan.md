# vendy.ltd: visual redesign plan

**Date:** 2026-10-08
**Status:** plan only, nothing built yet.
**Scope:** new look for the static site in `src/`. Same text, same images, same URLs, same build (`build.py`, partials, `site.json`). Only `main.css`, `main.js`, the partials and the page markup change.

**Fixed (carried over from the migration plan):**
- Content verbatim (D6): every sentence, price, name, bio, video, typo included. No new marketing copy in page bodies. Only UI microcopy (button labels, captions, alt text) may be touched, and only where listed in section 9.
- Images: the 17 files in `src/static/assets/img/` and nothing else. Crops and backgrounds can change; no new photos, no stock, no illustrations.
- Google Form for contact, Google Doc iframes for the two FAQ pages, YouTube facades, GTM, `.htaccess`, sitemap: unchanged.

---

## 1. What we are designing for

| | |
|---|---|
| Subject | A small Dhaka company that designs and builds wall-mounted hygiene (menstrual pad) vending machines in Bangladesh: steel bodies, Wi-Fi, coin / MFS / RFID payment. |
| Audience | Buyers for garment factories, corporate offices, NGOs and housing societies (people who sign a ৳25,000-60,000 purchase), plus partners checking credibility. Many on Android phones over mobile data. |
| Primary job | Show the four machines clearly enough (model, capacity, weight, price) that a buyer calls or sends the form. |
| Secondary jobs | Prove it is real and local (build photos, team), teach use (tutorials), answer questions (FAQ docs). |

### What the material tells us (audit of the images)
- **Logo**: green wordmark `#0C6048`, red butterfly `#E41824`, tagline "Vending out of the cocoon".
- **Machines** are loud: teal `#0A9CBF` (FTu25), teal + magenta `#841848` (HVu120), white + hot pink (HVu20, HVu40/60), all-magenta (about photo). They already carry Bangla labels, keypads, QR codes.
- **Product photos** are cut-outs on white (FTu25 has alpha). They can stand on a shared surface.
- **Hero slides are posters with baked-in text** (English and Bangla, contact details, a "3D Drawing → Laser Cutting → Bending → Pre-Coloring → Final Product" strip). Overlaying a headline on them, or cropping them with `object-fit: cover`, damages that text. The current site crops them.
- **Team photos**: 6 square portraits of mixed quality and backgrounds.

### Problems with the current build (why redesign)
1. Hero crops baked-in poster text at most widths.
2. Four identical tall product cards with long feature lists: the four machines look the same and the price is buried at the bottom of each.
3. Palette (cream `#faf8f3` + green + red) is generic and the machines' own colours fight it.
4. System font only, no type personality.
5. Every page is "heading, then a box". No sense of a hardware maker.

---

## 2. Concept: "the showroom wall"

The machines are wall-mounted, so the site is a wall. A cool brushed-steel surface, a single floor/mounting line, and the machines standing on it at their real relative heights. Everything else stays quiet so the machines' teal and pink are the colour on the page.

**The one memorable element: the lineup.** On the homepage, the four machines stand side by side on one mounting line, scaled to their relative size (HVu20 small, HVu120 large), each with its model code set large underneath like a stamped nameplate. Selecting a machine scrolls to its spec plate. Everything else on the site is disciplined and calm so this carries the identity.

Supporting idea: **model codes as type.** `FTu25`, `HVu120`, `HVu20`, `HVu40/60` are the brand's own vocabulary. They are set in a wide, heavy cut of the display face and used as the main product headings, with the long product name below them.

---

## 3. Tokens

### 3.1 Colour

Base is cool steel, not cream. Brand green carries structure and text; red is reserved for the contact action; teal appears only where it means "machine".

| Token | Hex | Role |
|---|---|---|
| `--steel` | `#E3E7E6` | Page background (cool grey, brushed-panel feel) |
| `--panel` | `#F6F8F8` | Raised surfaces: spec plates, doc frames, nav panel |
| `--ink` | `#10241D` | Body text and headings (green-black, from the logo green) |
| `--cocoon` | `#0C6048` | Brand green: links, rules, active nav, dark section background |
| `--butterfly` | `#E41824` | Contact actions only (form button, `tel:` button). Nothing else is red. |
| `--machine` | `#0A9CBF` | Lineup floor line, focus ring on the lineup, video play glyph. Never used for text on light backgrounds (contrast ~3:1). |

Derived: `--ink-muted` `#45574F`, `--line` `#C9D0CE`, `--cocoon-deep` `#08402F` (dark band).

Contrast to verify in Phase 1 (target AA): ink on steel, ink-muted on steel, white on butterfly (about 4.6:1, passes for 16px+ bold button text), white on cocoon, panel text on cocoon-deep.

**Dark mode:** keep it, but as a "lights off" version of the wall: steel `#16201D`, panel `#1E2A26`, ink `#E6ECEA`. Product cut-outs sit on white: in dark mode put each machine on a light `--panel`-coloured plinth instead of blending into the background.

### 3.2 Type

One family, using its width axis as the expressive tool (stamped nameplate vs. readable body).

| Role | Face | Setting |
|---|---|---|
| Model codes, page titles | **Archivo** variable, `wdth` 125 (Expanded), weight 800 | Large, tight tracking (`-0.01em`), used as the visual element |
| Section headings | Archivo, `wdth` 100, weight 700 | |
| Body, lists, UI | Archivo, `wdth` 100, weight 400 / 600 | 17-18px, line-height 1.6, measure 60-72ch |
| `৳` and any Bangla | **Hind Siliguri** 600, subset to Bengali block | Archivo has no `৳` (U+09F3); declare Hind Siliguri second in the stack so it only covers missing glyphs |

- Self-host as woff2 (`assets/fonts/`), `font-display: swap`, preload the Archivo variable file. Two files total.
- Type scale (1.25 ratio, fluid with `clamp()`): 14 / 17 / 21 / 27 / 34 / 42 / 64-96 (model codes and page titles only).
- No all-caps labels, no letter-spaced eyebrows, no monospace data labels, no single-word colour accents in headings.

### 3.3 Shape, space, depth

- Radius by hierarchy, not one value: buttons `6px`, spec plates and frames `2px` (sheet metal), portraits `0` (square crop as supplied).
- One shadow, used only under the lineup machines as a contact shadow on the floor line. Everything else is flat with `1px var(--line)` borders.
- Spacing scale 4/8/16/24/40/64/104. Max width 1200px, 16px gutter on mobile, 24px desktop.
- Left-aligned text everywhere. Centring only inside the lineup nameplates.

### 3.4 Motion

One orchestrated moment: on the homepage, the lineup machines rise onto the floor line in sequence on first load (transform/opacity, ~600ms total). Nothing else animates on its own except the hero slider. Hover and focus states change colour/underline only, no card lifts. `prefers-reduced-motion`: no rise, slider does not autoplay.

---

## 4. Shared chrome

### Header
```
┌───────────────────────────────────────────────────────────────────────┐
│ [VENDY logo]   Products  About  Tutorials  FAQ's  Our Team  Contact   [Send a message] │
└───────────────────────────────────────────────────────────────────────┘
```
- Slim, `--panel` background, 1px bottom line, sticky.
- Nav keeps all 8 items (Home via logo; Resources stays as a link on desktop if space allows, otherwise only in the mobile panel). Active page: 2px `--cocoon` underline.
- Mobile: logo + "Menu" button; panel slides down full width, items 48px tall, the form button at the bottom in red.

### Footer
`--cocoon-deep` background, white text. Three columns on desktop, stacked on mobile:
```
┌──────────────────────────────────────────────────────────────┐
│ VENDY (logo on a white tile)  │ +880 1714-890252   │ Products     │
│ Vending out of the cocoon     │ info@vendy.ltd     │ Tutorials    │
│ Address (full, verbatim)      │ [Send a message]   │ FAQ's ...    │
│ Copyright@Vendy.Ltd                                              │
└──────────────────────────────────────────────────────────────┘
```
The logo PNG is green-on-transparent, so on the dark footer it sits on a small white tile (no recolouring of the logo).

---

## 5. Homepage

Order: lineup (new hero) → build-story slider → spec plates → resources → contact band.

```
┌──────────────────────────────────────────────────────────────┐
│ header                                                        │
├──────────────────────────────────────────────────────────────┤
│ Products                                                      │
│                                                               │
│            ┌──┐                                               │
│   ┌──┐     │  │              ┌──┐                             │
│   │  │     │  │     ┌─┐      │  │      ← cut-outs, real      │
│   │  │     │  │     │ │      │  │        relative heights    │
│ ══╧══╧═════╧══╧═════╧═╧══════╧══╧════  ← teal mounting line  │
│   FTu25    HVu120   HVu20   HVu40/60   ← Archivo Expanded 800 │
│   ৳35,000  ৳60,000  ৳25,000 ৳40,000                          │
├──────────────────────────────────────────────────────────────┤
│ [ hero slider: full poster, uncropped, 2.16:1, on steel ]     │
│   ‹  ● ○ ○ ○ ○  ›          caption: "Vendy being built"       │
├──────────────────────────────────────────────────────────────┤
│ spec plate × 4 (alternating image side)                       │
├──────────────────────────────────────────────────────────────┤
│ Resources: Tutorials | FAQ's        (two wide link rows)      │
├──────────────────────────────────────────────────────────────┤
│ Contact band (cocoon-deep)                                    │
└──────────────────────────────────────────────────────────────┘
```

### 5.1 Lineup (`#products`)
- Heading "Products" (existing text). No invented tagline.
- Four `<a href="#ftu25">` etc., each: machine cut-out, model code, price. Product images get `mix-blend-mode: multiply` on the steel background so their white backgrounds disappear (FTu25 already has alpha).
- Relative heights from the stated weights/capacities are not reliable, so set them by eye from the photos: HVu20 smallest, HVu40/60 and FTu25 mid, HVu120 tallest. Fixed in CSS, documented in a comment.
- Mobile (375px): horizontal scroll-snap row of the four machines on the same floor line, with the next machine peeking at the edge. No wrap to a grid (it would break the "one wall" idea).
- `#products` anchor stays here so the nav link and old links keep working.

### 5.2 Hero slider, moved and fixed
- Same 5 images, same alt text, same order.
- Shown **whole**: `aspect-ratio` from each image, `object-fit: contain`, on a `--panel` strip. Never cropped, never overlaid. Hero-5 is wider (2.74:1); the frame takes the 2.16:1 ratio and letterboxes hero-5 on `--panel`.
- The alt text becomes a visible caption under the frame, so each poster has a plain-language label.
- Controls below the image, not on it: prev / dots / next, 44px targets. Autoplay 6s, pauses on hover, focus and when off-screen; swipe kept.
- First slide stays the LCP-friendly `<img fetchpriority="high">` only if the slider remains above the fold on mobile; otherwise the first lineup image gets priority (decide when measuring, Phase 4).

### 5.3 Spec plates (one per machine, `id="ftu25"` etc.)
The memorable lineup is the overview; the plate is the datasheet.
```
┌───────────────────────────────────────────────────────────────┐
│ ┌───────────┐  HVu120                    ← Archivo Expanded   │
│ │           │  HVu120 Hygiene Vendy Spiral Model              │
│ │  machine  │                                                  │
│ │  photo    │  ৳ 60,000                    [Learn More]        │
│ │           │  ─────────────────────────────────────────────── │
│ │           │  Single Spiral Magazine   Equipped with a seal…  │
│ │           │  Built-in Wi-Fi …         Stay connected …       │
│ └───────────┘  Durable Steel Body       Crafted with …         │
│                (definition-list rows, term left / text right)  │
└───────────────────────────────────────────────────────────────┘
```
- Model code (derived from the existing product name, not new copy) as the plate heading; full product name under it.
- Price moves up next to the name, large, `৳` in Hind Siliguri.
- Key features become a two-column definition list (bold lead-in as `<dt>`, the rest as `<dd>`); single column on mobile. Text stays verbatim, "Key features:" heading kept.
- Plates alternate image left / right on desktop. `--panel` surface, 2px radius, 1px line.
- "Learn More" stays as is (→ `/vending_details/`), outline button in green.

### 5.4 Resources (`#resources`, legacy `#resouces` kept)
Two full-width link rows (Tutorials, FAQ's) with a short arrow glyph drawn in CSS, not a card grid. Optionally add a third row for the vending FAQ page (`/vending_details/`); see section 9.

### 5.5 Contact band
`--cocoon-deep` background. Existing heading and sentence, phone and email as large tappable links, red "Send a message" button.

---

## 6. Inner pages

Shared page head: page title in Archivo Expanded 800 at 64-96px, left-aligned, sitting on the steel background with a 1px rule under it. No banner image.

| Page | Layout |
|---|---|
| **About** | Asymmetric split: text column (60-68ch, 3 paragraphs verbatim) left, the magenta about-machine photo right and taller than the text, bleeding to the container edge. On mobile the photo comes first, full width. The build-story poster (hero-1) appears again below as a full-width figure, uncropped, captioned "Vendy being built", since it is the best proof of local manufacturing. |
| **Our Team** | Founder row: large portrait (square, 320px) + name in Archivo Expanded + role + bio. Then groups as on the current page (Team Lead, IT Team, Electrical Team) with group headings. Members in a 3-up grid (2-up tablet, 1-up phone); square photos, name, role, bio below; no card boxes, just spacing and a top rule per group. Portraits get a light shared treatment (`filter: saturate(.9) contrast(1.05)`) so mixed photo quality reads as one set. |
| **Tutorials** | Each tutorial is a split: video facade (16:9, play glyph in `--machine` teal) and the step list. The steps really are a sequence, so they get large step numbers (1, 2, 3) in Archivo Expanded; the "Step 1:" text stays in the copy. Alternate video side per tutorial on desktop. |
| **FAQ's** and **vending_details** | Page title, then the Google Doc in a `--panel` frame that reads as a sheet of paper on the wall (white inner, 1px line, 2px radius), height `min(80vh, 900px)`. "Open full document" link above the frame on mobile (so users find it before scrolling inside the iframe) and below on desktop. |
| **Contact Us** | Split: left a `--panel` plate with the definition list (Vendy Ltd. address, E-Mail, Phone, Website, verbatim), phone and email as large links, the red "E-Mail Us" button. Right: the map iframe, same height as the plate, 2px radius. Mobile: plate, then map. |
| **404** | Page title "Page not found", existing sentence, three links. Below them, the lineup machines repeated small and greyed out, linking to `/#products`. Reuses the lineup component, no new asset. |

---

## 7. Accessibility and performance floor

- Every interactive target ≥ 44px; visible `:focus-visible` ring (2px `--ink` outline + 2px offset; on the dark band, white).
- Lineup links have an accessible name: "FTu25 LC Folding Tray Model, ৳35,000".
- Slider: pause button added (WCAG 2.2.2) next to the dots; `aria-live="polite"` caption only when not autoplaying.
- No horizontal page scroll at 320px (the lineup scrolls inside its own container).
- Fonts: 2 woff2 files, ~60-90 KB total. CSS stays one file; JS stays one file and under ~5 KB.
- Lighthouse mobile ≥ 90 in all four categories (same target as migration plan).

---

## 8. Review against generic defaults

Checked the plan against what a generic "hardware company site" would get:

| Generic default | Where the first draft went | Changed to |
|---|---|---|
| Full-bleed hero slider with a headline overlaid | Kept the slider as hero | Lineup is the hero; posters moved below, shown whole, never overlaid (they already contain text) |
| 4 identical product cards with hover lift | Product grid | Lineup + per-machine spec plates; no hover lift |
| Cream background + serif + warm accent | Current site already near this (`#faf8f3`) | Cool steel base taken from the machine bodies and build photos |
| Mono font for specs, caps eyebrows | Considered mono for model codes | Model codes in the expanded width of the same family; no eyebrows |
| Numbered markers as decoration | | Numbers only on tutorial steps, which are a real sequence |
| Red everywhere for "energy" | | Red only on contact actions |

---

## 9. Decisions to confirm with client

1. **Model codes as headings** (`FTu25`, `HVu120`, `HVu20`, `HVu40/60`) above the existing product names. They come from the existing names, but this is new heading text. OK?
2. **Hero slider moves below the lineup** on the homepage. OK, or must the slider stay first?
3. **Slider captions** under each poster reuse the current alt text ("Vendy being built", "Vendy being used with office ID", ...). OK as visible text?
4. **Resources section**: add a link to `/vending_details/` next to Tutorials and FAQ's? (Page exists, but the current Resources section links only two.)
5. **Header button wording**: keep "Send a message", or "Contact Us"? (Already open in the task list.)
6. **Typos** stay verbatim unless the client asks (already open in the task list).

---

## 10. Build phases

| Phase | Work | Est. |
|---|---|---|
| 1. Tokens and type | Download and subset Archivo + Hind Siliguri (in Docker, `fonttools pyftsubset`), `@font-face`, colour tokens, contrast check script, base typography | 0.5 day |
| 2. Chrome | Header, mobile panel, footer, page head | 0.5 day |
| 3. Homepage | Lineup (incl. mobile scroll-snap and the load sequence), slider rework (contain, captions, pause button), spec plates, resources, contact band | 1.5 days |
| **Checkpoint** | Show homepage at 375 / 768 / 1440, light and dark, to client before inner pages | |
| 4. Inner pages | About, Team, Tutorials, FAQ frames, Contact, 404 | 1 day |
| 5. QA | Playwright screenshots (Docker) at 320 / 375 / 768 / 1440, light and dark; overflow check; Lighthouse mobile; keyboard pass; content diff against current `src/pages` text (no sentence lost); `.htaccess` redirect tests rerun on `httpd:2.4-alpine` :8091 | 0.5-1 day |
| **Total** | | **~4-4.5 days** |

### Files touched
- `src/static/assets/css/main.css`: rewritten.
- `src/static/assets/js/main.js`: slider changes (contain, caption, pause), lineup load sequence; nav and YouTube facade kept.
- `src/static/assets/fonts/`: new (2 woff2).
- `src/partials/head.html`: font preload. `header.html`, `footer.html`: new markup.
- `src/pages/*.html`: markup restructured, text unchanged.
- `build.py`, `site.json`, `.htaccess`: no change expected.

### Risks
- **Cut-out quality**: `mix-blend-mode: multiply` hides white backgrounds on light steel, but any off-white halo in HVu20 / HVu40-60 (JPEG-origin) will show. Fallback: give each machine a `--panel` plinth tile instead of blending. Check in Phase 3 at 2x zoom.
- **Lineup on very small screens**: four tall machines at 320px. Scroll-snap row solves width; height capped at 55vh.
- **Archivo `wdth` axis**: confirm the Google Fonts variable file includes the width axis before committing to it; if not, fall back to Archivo static Expanded ExtraBold + Regular + SemiBold (3 files).
