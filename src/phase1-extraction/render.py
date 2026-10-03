import pymupdf, os

jobs = [
    (r"C:\Users\svans\OneDrive\Desktop\Capex Construction & Engineering — Company Profile.pdf", "main", [1,6,12,18,19,20,21]),
    (r"C:\Users\svans\OneDrive\Desktop\Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf", "doc12", [1,11,12,13]),
    (r"C:\Users\svans\OneDrive\Desktop\Capex Profile for Electrical and CGD (1).pdf", "ecgd", [1,5,9,19]),
]
outdir = r"C:\Users\svans\OneDrive\Desktop\Corporate Clarity\phase1-extraction"
for src, tag, pages in jobs:
    doc = pymupdf.open(src)
    for p in pages:
        if p-1 >= doc.page_count: continue
        page = doc[p-1]
        pix = page.get_pixmap(dpi=110)
        out = os.path.join(outdir, f"{tag}_p{p:02d}.png")
        pix.save(out)
        print(out, pix.width, "x", pix.height)
    doc.close()
