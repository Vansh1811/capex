import sys, os
import pymupdf

srcs = [
    (r"C:\Users\svans\OneDrive\Desktop\Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf", "doc12.txt"),
    (r"C:\Users\svans\OneDrive\Desktop\Capex Profile for Electrical and CGD (1).pdf", "ecgd.txt"),
    (r"C:\Users\svans\OneDrive\Desktop\Capex Construction & Engineering — Company Profile.pdf", "main.txt"),
]
outdir = r"C:\Users\svans\OneDrive\Desktop\Corporate Clarity\phase1-extraction"

for src, outname in srcs:
    print(f"=== {os.path.basename(src)} ===")
    try:
        doc = pymupdf.open(src)
        print(f"pages: {doc.page_count}, metadata title: {doc.metadata.get('title')}")
        lines = []
        for i, page in enumerate(doc):
            txt = page.get_text("text")
            lines.append(f"\n----- PAGE {i+1} -----\n{txt}")
        out = os.path.join(outdir, outname)
        with open(out, "w", encoding="utf-8") as f:
            f.write("".join(lines))
        total_chars = sum(len(l) for l in lines)
        print(f"wrote {outname}: {total_chars} chars")
        doc.close()
    except Exception as e:
        print(f"ERROR: {e}")
