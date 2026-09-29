# -*- coding: utf-8 -*-
"""Compress the 2026 Uttoron archive into a public carousel manifest."""
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path(r"C:\Users\Parag\Documents\uttaron-archive")
OUT = Path(r"C:\Users\Parag\Documents\displayartforseatac\gallery\media")
MANIFEST = Path(r"C:\Users\Parag\Documents\displayartforseatac\gallery\manifest.json")
MAX_EDGE = 1400
QUALITY = 72

def category(event):
    e = (event or "").lower()
    if "decor" in e or e.startswith("uve"):
        return "Decoration"
    if "agomoni" in e:
        return "Agomoni"
    if "sharad" in e or "deepaboli" in e or "pujo" in e:
        return "Sharadotsav"
    if "ankita" in e:
        return "Ankita"
    if "bhoomi" in e or "anjan" in e:
        return "Bhoomi"
    if "magazine" in e:
        return "Magazine"
    if "volunteer" in e:
        return "Volunteers"
    return "Other"

def kind_and_date(name):
    m = re.match(r"(\d{4}-\d{2}-\d{2})_([a-z]+)_", name, re.I)
    if not m:
        return "", "image"
    return m.group(1), m.group(2)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(
        p for p in SRC.rglob("*")
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    items = []
    for i, src in enumerate(files, start=1):
        parts = src.relative_to(SRC).parts
        month = parts[0] if len(parts) > 2 else ""
        event = parts[1] if len(parts) > 2 else "Uttoron"
        date, kind = kind_and_date(src.name)
        if not date.startswith("2026"):
            continue
        cat = category(event)
        dest_name = f"{i:04d}.jpg"
        dest = OUT / dest_name
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode not in ("RGB",):
                im = im.convert("RGB")
            im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        items.append({
            "src": f"media/{dest_name}",
            "date": date or month,
            "month": month,
            "kind": kind,
            "category": cat,
            "event": event.replace("  ", " ").strip(),
            "label": f"{cat} · {date or month} · {kind}",
        })
    order = ["Decoration", "Agomoni", "Sharadotsav", "Ankita", "Bhoomi", "Magazine", "Volunteers", "Other"]
    groups = []
    for name in order:
        group = [it for it in items if it["category"] == name]
        group.sort(key=lambda it: (it["date"], it["src"]))
        if group:
            groups.append({"id": name.lower(), "label": name, "items": group})
    MANIFEST.write_text(json.dumps({"year": 2026, "count": len(items), "groups": groups}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(items)} images -> {OUT}")

if __name__ == "__main__":
    main()
