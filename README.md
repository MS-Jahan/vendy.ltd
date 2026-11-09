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

## Pages, sitemap and redirects

- Pages: Home, Products, About Us, Resources, Our Team, Contact Us (plus 404). Tutorials, FAQ's and Vending Machine FAQ's now live on `/resources/` as sections (`#tutorials`, `#faqs`, `#vending-faqs`).
- `sitemap.xml` is generated from `src/pages/` on every build, so a deleted page drops out by itself. `robots.txt` allows everything and points to the sitemap.
- Old URLs (`/tutorials/`, `/faqs/`, `/vending_details/` and the WordPress `?page_id=` links) 301-redirect to the right section in `src/static/.htaccess`. When you remove a page, add a redirect there and delete its folder on the server (the deploy never deletes).
- CSS and JS URLs carry a content hash (`?v=...`) added by `build.py`, so Cloudflare serves new files right after a deploy.

## Editing

- Change text in `src/pages/*.html`, then rebuild.
- Change contact details in `site.json`. The contact form URL (`form_url`) is the Google Form at https://forms.gle/aVQzGni7F437acgb8.
- A new page needs a front-matter comment and, for a navbar highlight, a `nav` key listed in `NAV_KEYS` in `build.py`.
- Always rebuild and commit `dist/` together with `src/`.

## Deploy (cPanel)

Upload the contents of `dist/` to `public_html`. `.htaccess` forces HTTPS and the apex domain (`vendy.ltd`) and redirects old WordPress URLs to the new pages.

Note: at the time of writing, `vendy.ltd` is redirected to Facebook by a Cloudflare rule, and `www.vendy.ltd` returns a 500 from the old hosting. Fix both before launch.

## Deploy via GitHub Actions (FTP)

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is manual (Actions tab > **Deploy (FTP)** > Run workflow). It runs `python3 build.py`, then uploads `dist/` to the cPanel folder in `FTP_SERVER_DIR` with `lftp`. Files already on the server that are not in `dist/` are left alone.

| Input | Effect |
|---|---|
| `dry_run` | List what would transfer, upload nothing. |
| `delete` | Also delete server files that are not in `dist/`. Use with care. |
| `verbose_log` | Verbose lftp log. |

Repository secrets (Settings > Secrets and variables > Actions):

| Secret | Purpose |
|---|---|
| `FTP_SERVER` | Required. FTP hostname. |
| `FTP_USER` / `FTP_PASS` | Required. cPanel FTP account. |
| `FTP_SERVER_DIR` | Remote folder with trailing slash, relative to the FTP account root. Default `./` (the FTP account root). |
| `FTP_PORT` | Optional, default `21`. |
| `FTP_PROTOCOL` | `ftp` (default), `ftps` (explicit TLS, common on cPanel) or `ftps-legacy` (implicit, port 990). |

Run it with `dry_run` first to confirm the target folder.
