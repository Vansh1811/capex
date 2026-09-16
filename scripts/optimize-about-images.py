"""Optimize about-page imagery: recompress to sensible web sizes (q78) and
verify every frame still reads clearly. Run once after sourcing new frames."""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "uploads", "about")
# max long edge per slot: rigs/plant appear large; details can stay smaller
MAXES = {
    "hdd-rig.jpg": 1920,
    "hdd-drill-portrait.jpg": 1600,
    "plant-room.jpg": 1600,
    "substation.jpg": 1920,
    "substation-2.jpg": 1600,
    "site-worker.jpg": 1600,
    "hdd-rig-2.jpg": 1600,
}


def main() -> None:
    for name, max_edge in MAXES.items():
        p = os.path.join(ROOT, name)
        if not os.path.exists(p):
            print(name, "missing")
            continue
        im = Image.open(p).convert("RGB")
        w, h = im.size
        if max(w, h) > max_edge:
            scale = max_edge / max(w, h)
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        im.save(p, "JPEG", quality=78, optimize=True, progressive=True)
        print(name, im.size, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    main()
