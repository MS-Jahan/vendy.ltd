# Static site build: task list (2026-10-08)

Source: `src/`. Build: `python3 -I build.py` → `dist/` (stdlib only). Upload `dist/` contents to cPanel `public_html` manually (client-side).

## Done
- [x] Content copied verbatim from local WP (`http://localhost:8090/`), all 7 pages + homepage.
- [x] Images: 10 WebP + logo + favicons; 5 hero slides from the same files as the Rev Slider.
- [x] Build script with front matter, shared head/header/footer, placeholders from `site.json`, sitemap.
- [x] Single stylesheet (`main.css`) and one small vanilla JS file (`main.js`): nav toggle, hero slider, YouTube facade.
- [x] Pages: home, about, our-team, contact-us, faqs, vending_details, tutorials, 404. URLs unchanged.
- [x] `.htaccess`: HTTPS + apex, old page ids, removed WP pages, WP endpoints → 410, gzip, cache.
- [x] Docker test (httpd:2.4-alpine, port 8091): all redirects and 404/410 checked.
- [x] Browser test (Playwright in Docker): no horizontal overflow at 375px or 1440px, slider, nav, video facade work, no JS errors (external GTM/YouTube blocked in sandbox only).

## Open
- [ ] Client: real Google Form URL → `site.json` `form_url` (currently `PLACEHOLDER_FORM_ID`), then rebuild.
- [ ] Verify product photo mapping: cards use the first photo of each WP gallery in page order (FTu25 → `c67b27d4`, HVu120 → WhatsApp image, HVu20 → `DSC_0964`, HVu40/60 → `Untitled4`). Team photo mapping: Rudro = `WhatsApp-Image-2025-01-14`. Both inferred, confirm.
- [ ] Verify HTTPS redirect rule on the real host (cannot test locally: needs TLS).
- [ ] Test the Google Doc iframes on phone and desktop (height is tall, scrolls inside the frame).
- [ ] Old WP `wp-content/uploads` URLs now return 410 (not in dist). Decide whether any are linked from outside.
- [ ] Remove backup zips and `wp-content/ai1wm-backups` from public webroot (security, separate from build).
- [ ] Header button says "Send a message" (not "Contact Us"); confirm wording.
- [ ] Content typos kept verbatim per decision D6 (e.g. "Receive you product", "He possess", "Garmetns"); confirm if client wants them fixed.
- [ ] Old WP "Resources" anchor `/#resouces` kept as an empty span; `/resouces/` redirects to `/`.

## Redesign v2 (2026-10-08): Stitch "Industry" mockups, supersedes `2026-10-08-redesign-plan.md`
Source: `../Vendy.ltd-UI-mockups/Vendy Mockups.dc.html` (home 2a/2b, inner pages 1c-1g).
- [x] Home: giant VENDY hero with the four machines on one ground line (rise-in on load), clickable. One live datasheet at a time (lineup, index tabs and compare-table rows all switch it; all four stack without JS). Comparison table, whole-poster slider with counter, caption, Pause, arrows. Resources, contact band, footer.
- [x] About, Our Team (duotone photos), Tutorials, Contact (real map), FAQ's and vending_details (built in the same language; not in the mockups), 404.
- [x] Fonts self-hosted: Barlow 400/500/600, Barlow Condensed 600, Hind Siliguri subset (taka sign only). Archivo removed. No dark mode (mockup system is light only).
- [x] Pages are generated from the original markup, so text is verbatim. Differences: slider arrows are ← →, the "·" between phone and email is gone, derived labels added (Holds, Weight, Payment, "up to N pads"), FTu25 weight shown as "—" (not in the source text).
- [x] Machines are CSS crops of the product photos (per-photo vars in `main.css`), no blend mode. Relative heights set by eye.
- [ ] Client: brand red/green appear only in the logo (mockup choice). Say if contact buttons should be red.
- [ ] Check on a real phone: lineup, picker tabs, slider, compare table stack.
- [ ] Mobile hero: HVu120 looks small next to HVu40/60 (wide photo in a narrow column). Tune `--rel` if wanted.

## Redesign v3 (2026-10-08): one page per menu item (client feedback)
- [x] Home is now an introduction: slideshow first (auto-advances every 3 s, Pause/arrows/dots, pauses on hover/focus/off-screen), then VENDY + first About paragraph + About Us button, then links to the pages, then the contact band. No product details on Home.
- [x] New pages: `/products/` (machine lineup, one live datasheet, compare table) and `/resources/` (Tutorials, FAQ’s, Vending Machine FAQ’s). Menu now links Products → `/products/`, Resources → `/resources/`; no more `/#...` links. Sitemap picks them up.
- [x] Old links: `/resouces/` 301s to `/resources/`; `/#products` and `/#resources` on Home are redirected by `main.js`.
- [x] Team photos keep the blue duotone and show their original colours on hover.
- [ ] 3 s per slide is fast for the text-heavy posters (WCAG 2.2.2 is met by the Pause button). Change `3000` in `main.js` if the client wants longer.
- [ ] Verify the new `.htaccess` redirect on the real host.
