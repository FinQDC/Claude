#!/usr/bin/env python3
"""Bouwt een single-file HTML uit de Next export, inline CSS, Google Fonts via CDN."""
import re
import sys
from pathlib import Path

OUT_DIR = Path('out')
HTML_IN = OUT_DIR / 'locatie' / 'de-wilgenhof.html'
CSS_IN = list((OUT_DIR / '_next' / 'static' / 'chunks').glob('*.css'))[0]
HTML_OUT = Path('/tmp/de-wilgenhof.html')

html = HTML_IN.read_text(encoding='utf-8')
css = CSS_IN.read_text(encoding='utf-8')

# Strip next/font @font-face blocks (referencen ../media/*.woff2 die file:// niet bereikt)
css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)

# Strip next/font variable klassen op <html>
html = re.sub(r'\sclass="[^"]*fraunces[^"]*inter[^"]*"', '', html)

# Strip preload links + script tags + module preload
html = re.sub(r'<link[^>]*rel="preload"[^>]*>', '', html)
html = re.sub(r'<link[^>]*rel="modulepreload"[^>]*>', '', html)
html = re.sub(r'<link[^>]*rel="stylesheet"[^>]*href="/_next/[^"]*"[^>]*/?>', '', html)
html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.DOTALL)
html = re.sub(r'<script\b[^/>]*/>', '', html)

# Voeg in <head>: Google Fonts + inline CSS + var-mapping
fonts_link = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link href="https://fonts.googleapis.com/css2?'
    'family=Fraunces:opsz,ital,wght@9..144,0,400;9..144,0,500;9..144,0,600;9..144,1,400;9..144,1,500'
    '&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">'
)

var_map = (
    '<style>:root{--font-fraunces:"Fraunces",Georgia,serif;'
    '--font-inter:"Inter",-apple-system,sans-serif;}</style>'
)

inline_css = f'<style>{css}</style>'

head_inject = fonts_link + var_map + inline_css
html = html.replace('</head>', head_inject + '</head>', 1)

# Maak relatieve links bruikbaar — knip de breadcrumb/topbar links naar # (anchors)
# Niet nodig, want ze gaan al naar # in de source

HTML_OUT.write_text(html, encoding='utf-8')
print(f'wrote {HTML_OUT} ({len(html):,} bytes)')
