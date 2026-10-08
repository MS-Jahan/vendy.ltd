# vendy.ltd

Static website for [Vendy Ltd](https://vendy.ltd), a Bangladeshi vending machine maker. It replaces the old WordPress site. Plain HTML, CSS and JS, built with a small Python script (standard library only, no dependencies).

## Layout

| Path | What it is |
|---|---|
| `src/pages/` | One HTML file per page, each starting with a front-matter comment (`title`, `description`, `path`, `nav`) |
| `src/partials/` | Shared `head`, `header` and `footer` |
| `src/static/` | Copied as-is into `dist/`: CSS, JS, images, fonts, `.htaccess`, `robots.txt` |
| `site.json` | Site-wide values: phone, email, address, GTM ID, contact form URL |
| `build.py` | Builds `src/` into `dist/` and generates `sitemap.xml` |
| `dist/` | Built site, committed so it can be uploaded directly |
| `docs/` | Migration plan, redesign plan and content brief |

## Build

```sh
python3 build.py
```

Needs Python 3. It wipes and recreates `dist/`. Placeholders such as `{{phone}}` or `{{form_url}}` are filled from `site.json` and each page's front matter. The build fails on an unknown placeholder or missing front matter.

To preview, serve `dist/` with any static server, for example `python3 -m http.server -d dist 8080`. This does not apply the `.htaccess` rules.

## Editing

- Change text in `src/pages/*.html`, then rebuild.
- Change contact details in `site.json`. The contact form URL is still a placeholder (`PLACEHOLDER_FORM_ID`).
- A new page needs a front-matter comment and, for a navbar highlight, a `nav` key listed in `NAV_KEYS` in `build.py`.
- Always rebuild and commit `dist/` together with `src/`.

## Deploy (cPanel)

Upload the contents of `dist/` to `public_html`. `.htaccess` forces HTTPS and the apex domain (`vendy.ltd`) and redirects old WordPress URLs to the new pages.

Note: at the time of writing, `vendy.ltd` is redirected to Facebook by a Cloudflare rule, and `www.vendy.ltd` returns a 500 from the old hosting. Fix both before launch.
