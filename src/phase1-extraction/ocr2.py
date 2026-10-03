import pymupdf, os
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
jobs = [
    (r"C:\Users\svans\OneDrive\Desktop\Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf", "doc12", [14,15,16,17,18,19,20,21,22]),
    (r"C:\Users\svans\OneDrive\Desktop\Capex Profile for Electrical and CGD (1).pdf", "ecgd", [10,11,12,13,14,15,16,17,18]),
]
outdir = r"C:\Users\svans\OneDrive\Desktop\Corporate Clarity\phase1-extraction"

for src, tag, pages in jobs:
    print(f"\n########## {tag} ##########")
    doc = pymupdf.open(src)
    for p in pages:
        if p-1 >= doc.page_count: continue
        page = doc[p-1]
        pix = page.get_pixmap(dpi=170)
        png = os.path.join(outdir, "_ocr_tmp2.png")
        pix.save(png)
        result, _ = ocr(png)
        print(f"\n----- {tag} PAGE {p} -----")
        if result:
            seen = []
            for box, text, conf in result:
                if float(conf) > 0.55:
                    t = text.strip()
                    if t and (not seen or seen[-1] != t):
                        seen.append(t)
            print(" | ".join(seen[:45]))
        else:
            print("(no text detected)")
    doc.close()
