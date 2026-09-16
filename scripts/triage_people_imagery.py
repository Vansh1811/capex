"""Art-direction triage for candidate People-page frames (image-blind QA
substitute): per-frame 6x4 luminance grid, mean/median brightness and
warmth (R-B channel difference), plus aspect — warmth >= ~8 reads warm
(skin/earth/oxidized steel), grids with low spread read as flat
documentary frames rather than editorial plates."""
import os

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "output", "wm-candidates")


def triage(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    lum = im.convert("L").resize((6, 4))
    r, g, b = im.convert("RGB").split()
    small = im.resize((60, 40))
    rs, gs, bs = small.split()
    rmean = sum(rs.getdata()) / len(list(rs.getdata()))
    bmean = sum(bs.getdata()) / len(list(bs.getdata()))
    warmth = rmean - bmean
    grid = [f"{v:3d}" for v in lum.getdata()]
    print(f"\n== {os.path.basename(path)}  {w}x{h}  warmth(R-B)={warmth:+.0f}")
    for row in range(4):
        print("   ", " ".join(grid[row * 6 : (row + 1) * 6]))


for f in sorted(os.listdir(ROOT)):
    if f.endswith((".jpg", ".JPG")):
        triage(os.path.join(ROOT, f))
