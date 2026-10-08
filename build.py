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
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
SITE = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))

FRONT_MATTER = re.compile(r"\A\s*<!--(.*?)-->", re.S)
PLACEHOLDER = re.compile(r"\{\{\s*([\w.-]+)\s*\}\}")
NAV_KEYS = ["home", "products", "about", "resources", "tutorials", "faqs", "our-team", "contact-us"]


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


def write_sitemap(paths):
    urls = []
    for path in sorted(paths):
        if path.endswith(".html") or path == "/404.html":
            continue
        urls.append(f"  <url><loc>{SITE['site_url']}{path}</loc></url>")
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
    base_values = {k: v for k, v in SITE.items()}
    base_values["site_url"] = SITE["site_url"]

    paths = []
    for page in sorted((SRC / "pages").glob("*.html")):
        paths.append(build_page(page, partials, base_values))

    shutil.copytree(SRC / "static", DIST, dirs_exist_ok=True)
    write_sitemap(paths)
    print(f"built {len(paths)} pages into {DIST.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
