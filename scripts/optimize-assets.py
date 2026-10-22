#!/usr/bin/env python3
"""Convierte el arte de plantillas a WebP optimizado (piloto validado 2026-10-22:
~88% de ahorro en template-butterfly). Uso:
  optimize-assets.py <carpeta-origen> <carpeta-destino>
Reglas: png/jpg/jpeg -> webp (q82; tope 1440px si el nombre sugiere fondo/foto,
1200px el resto). svg/gif/otros se copian tal cual. Conserva subcarpetas."""
import os, shutil, sys
from PIL import Image

SRC, DST = sys.argv[1], sys.argv[2]
tot_o = tot_n = conv = skip = copy = 0
for root, _dirs, files in os.walk(SRC):
    for f in sorted(files):
        p = os.path.join(root, f)
        rel = os.path.relpath(p, SRC)
        s0 = os.path.getsize(p)
        tot_o += s0
        out_rel = os.path.splitext(rel)[0] + ".webp" if f.lower().endswith((".png", ".jpg", ".jpeg")) else rel
        out = os.path.join(DST, out_rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if not f.lower().endswith((".png", ".jpg", ".jpeg")):
            shutil.copy2(p, out); tot_n += s0; copy += 1; continue
        try:
            im = Image.open(p)
            w, h = im.size
            cap = 1440 if ("fondo" in f or "foto" in f or "bg" in f.lower()) else 1200
            if w > cap:
                im = im.resize((cap, int(h * cap / w)), Image.LANCZOS)
            im.save(out, "WEBP", quality=82, method=6)
            tot_n += os.path.getsize(out); conv += 1
        except Exception as e:
            shutil.copy2(p, os.path.join(DST, rel)); tot_n += s0; skip += 1
            print(f"  omitido ({e}): {rel}")
print(f"{SRC}: convertidos={conv} copiados={copy} omitidos={skip}")
print(f"  ANTES {tot_o/1048576:.1f} MB -> DESPUES {tot_n/1048576:.2f} MB (ahorro {100-100*tot_n/max(tot_o,1):.0f}%)")
