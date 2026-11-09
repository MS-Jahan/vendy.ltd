#!/usr/bin/env python3
"""Build the static site: src/ -> dist/. Python stdlib only.

Each page in src/pages/ starts with a front-matter comment:

    <!--
    title: About Us
    description: ...
    path: /about/
    nav: about
    -->

Placeholders {{key}} are filled from site.json, the page front matter,
and nav_<key> flags (" aria-current" on the active nav link).
"""
import hashlib
import urllib.error
import urllib.request
import os
import html
import subprocess
import json
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
SITE = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))

FRONT_MATTER = re.compile(r"\A\s*<!--(.*?)-->", re.S)
PLACEHOLDER = re.compile(r"\{\{\s*([\w.-]+)\s*\}\}")
NAV_KEYS = ["home", "products", "about", "resources", "our-team", "contact-us"]


# ---------------------------------------------------------------------------
# site.json -> placeholders. Nested keys become dotted names: {{docs.faqs.url}}
# ---------------------------------------------------------------------------
def flatten(data, prefix=""):
    out = {}
    for key, value in data.items():
        name = f"{prefix}{key}"
        if isinstance(value, dict):
            out.update(flatten(value, name + "."))
        elif isinstance(value, (str, int, float)):
            out[name] = str(value)
    return out


# ---------------------------------------------------------------------------
# Google Docs: the FAQ pages embed published Google Docs in iframes, which search
# engines do not read as part of the page. At build time the text of each doc is
# fetched, cached in data/doc-cache/ (committed, so builds work offline) and
# written into the page as a collapsed "read as text" section.
# ---------------------------------------------------------------------------
DOC_CACHE = ROOT / "data" / "doc-cache"
DOC_BLOCKS = {"p", "li", "td", "th", "h1", "h2", "h3", "h4", "h5", "h6"}


class DocText(HTMLParser):
    """Collect the text of a published Google Doc as (kind, text) blocks."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.inside = False
        self.skip = 0
        self.buf = []
        self.stack = []
        self.blocks = []

    def handle_starttag(self, tag, attrs):
        if dict(attrs).get("id") == "contents":
            self.inside = True
        if not self.inside:
            return
        if tag in ("style", "script"):
            self.skip += 1
        elif tag in DOC_BLOCKS:
            self.flush()
            self.stack.append(tag)
        elif tag == "br":
            self.buf.append(" ")

    def handle_endtag(self, tag):
        if not self.inside:
            return
        if tag in ("style", "script") and self.skip:
            self.skip -= 1
        elif tag in DOC_BLOCKS:
            self.flush()
            if self.stack:
                self.stack.pop()

    def handle_data(self, data):
        if self.inside and not self.skip:
            self.buf.append(data)

    def flush(self):
        text = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        self.buf = []
        if text:
            self.blocks.append(["li" if "li" in self.stack else "p", text])


def fetch_doc_blocks(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (vendy.ltd build)"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        page = resp.read().decode("utf-8", errors="replace")
    parser = DocText()
    parser.feed(page)
    parser.flush()
    return parser.blocks


def doc_blocks(key, url):
    """Fresh text from Google if reachable (and cache it), else the cached copy."""
    cache = DOC_CACHE / f"{key}.json"
    blocks = None
    if os.environ.get("VENDY_OFFLINE") != "1":
        try:
            blocks = fetch_doc_blocks(url)
            if sum(len(t) for _, t in blocks) < 200:
                print(f"warning: doc '{key}' returned almost no text; using cache")
                blocks = None
        except Exception as exc:  # network down, doc unpublished, layout changed
            print(f"warning: could not fetch doc '{key}' ({exc}); using cache")
    if blocks is not None:
        DOC_CACHE.mkdir(parents=True, exist_ok=True)
        payload = {"url": url, "blocks": blocks}
        new = json.dumps(payload, ensure_ascii=False, indent=1) + "\n"
        if not cache.exists() or cache.read_text(encoding="utf-8") != new:
            cache.write_text(new, encoding="utf-8")
        return blocks
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))["blocks"]
    print(f"warning: no text for doc '{key}' (no network and no cache)")
    return []


def render_doc_text(title, blocks):
    if not blocks:
        return ""
    parts, in_list = [], False
    for kind, text in blocks:
        if kind == "li" and not in_list:
            parts.append("<ul>")
            in_list = True
        if kind != "li" and in_list:
            parts.append("</ul>")
            in_list = False
        tag = "li" if kind == "li" else "p"
        parts.append(f"<{tag}>{html.escape(text)}</{tag}>")
    if in_list:
        parts.append("</ul>")
    return (
        '<details class="doc-text"><summary>Read this document as text</summary>'
        f'<div class="doc-text-body" lang="bn"><h3>{html.escape(title)}</h3>' + "".join(parts) + "</div></details>"
    )



def fail(msg):
    sys.exit(f"build error: {msg}")


def parse_page(path):
    text = path.read_text(encoding="utf-8")
    match = FRONT_MATTER.match(text)
    if not match:
        fail(f"{path.name}: missing front matter")
    meta = {}
    for line in match.group(1).strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    for required in ("title", "description", "path"):
        if required not in meta:
            fail(f"{path.name}: front matter lacks '{required}'")
    return meta, text[match.end():].strip()


def fill(template, values, where):
    def sub(match):
        key = match.group(1)
        if key not in values:
            fail(f"{where}: unknown placeholder {{{{{key}}}}}")
        return values[key]

    return PLACEHOLDER.sub(sub, template)


def output_path(page_path):
    if page_path.endswith(".html"):
        return DIST / page_path.lstrip("/")
    return DIST / page_path.strip("/") / "index.html"


def build_page(file_path, partials, base_values):
    meta, body = parse_page(file_path)
    values = dict(base_values)
    values.update(meta)
    values["canonical"] = SITE["site_url"] + meta["path"]
    for key in NAV_KEYS:
        values["nav_" + key] = " aria-current=\"page\"" if meta.get("nav") == key else ""

    where = file_path.name
    html = "".join(
        [
            fill(partials["head"], values, where),
            fill(partials["header"], values, where),
            fill(body, values, where),
            fill(partials["footer"], values, where),
        ]
    )
    target = output_path(meta["path"])
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8")
    return meta["path"]


def lastmod(source):
    """Date (YYYY-MM-DD) of the last commit that touched a source file, or ''."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", str(source.relative_to(ROOT))],
            cwd=ROOT, capture_output=True, text=True, timeout=10,
        ).stdout.strip()
        return out if re.fullmatch(r"\d{4}-\d{2}-\d{2}", out) else ""
    except Exception:
        return ""


def write_sitemap(paths, sources):
    urls = []
    for path in sorted(paths):
        if path.endswith(".html") or path == "/404.html":
            continue
        mod = lastmod(sources[path])
        tag = f"<lastmod>{mod}</lastmod>" if mod else ""
        urls.append(f"  <url><loc>{SITE['site_url']}{path}</loc>{tag}</url>")
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    (DIST / "sitemap.xml").write_text(xml, encoding="utf-8")


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    partials = {name: (SRC / "partials" / f"{name}.html").read_text(encoding="utf-8") for name in ("head", "header", "footer")}
    base_values = flatten(SITE)
    for key, doc in SITE.get("docs", {}).items():
        base_values[f"doc_text.{key}"] = render_doc_text(doc["title"], doc_blocks(key, doc["url"]))
    # Cache-busting version for CSS/JS URLs (Cloudflare caches them for hours)
    digest = hashlib.sha1()
    for asset in ("assets/css/main.css", "assets/js/main.js"):
        digest.update((SRC / "static" / asset).read_bytes())
    base_values["asset_v"] = digest.hexdigest()[:10]

    paths = []
    sources = {}
    for page in sorted((SRC / "pages").glob("*.html")):
        built = build_page(page, partials, base_values)
        paths.append(built)
        sources[built] = page

    shutil.copytree(SRC / "static", DIST, dirs_exist_ok=True)
    write_sitemap(paths, sources)
    print(f"built {len(paths)} pages into {DIST.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
