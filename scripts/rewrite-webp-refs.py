#!/usr/bin/env python3
"""Reescribe referencias del arte de plantillas en src/** de .png/.jpg/.jpeg
a su gemelo .webp (los originales se CONSERVAN en public/ como respaldo para
URLs ya guardadas en eventos existentes de la BD; solo cambia lo que el
codigo referencia). Uso: rewrite-webp-refs.py [--dry]"""
import os, re, sys

DRY = "--dry" in sys.argv
PREFIXES = [
    "/assets/template-butterfly/",
    "/assets/template-rose/",
    "/assets/template-quince-rosado/",
    "/assets/sobre-rosa/",
]
alt = "|".join(re.escape(p) for p in PREFIXES)
pat = re.compile("((?:" + alt + ")[^\"'\\s)]+?)\\.(png|jpg|jpeg)", re.IGNORECASE)
total = 0
for root, _dirs, files in os.walk("src"):
    for f in files:
        if not f.endswith((".ts", ".tsx", ".js", ".jsx", ".css")):
            continue
        p = os.path.join(root, f)
        s = open(p, encoding="utf-8").read()
        n = len(pat.findall(s))
        if n:
            total += n
            print(f"{n:3d}  {p}")
            if not DRY:
                open(p, "w", encoding="utf-8").write(pat.sub(r"\1.webp", s))
print(f"TOTAL referencias: {total}")
