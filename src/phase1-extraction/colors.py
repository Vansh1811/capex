import pymupdf
from collections import Counter

def dominant_colors(src, pages, topn=8):
    doc = pymupdf.open(src)
    for p in pages:
        if p-1 >= doc.page_count: continue
        pix = doc[p-1].get_pixmap(dpi=50)
        c = Counter()
        step = 2
        for y in range(0, pix.height, step):
            for x in range(0, pix.width, step):
                r,g,b = pix.pixel(x,y)[:3]
                # quantize to 32-level buckets
                q = (r//32*32, g//32*32, b//32*32)
                c[q]+=1
        total = sum(c.values())
        print(f"  page {p}: ", end="")
        for (r,g,b),n in c.most_common(topn):
            if n/total > 0.02:
                print(f"#{r:02x}{g:02x}{b:02x}({100*n//total}%) ", end="")
        print()
    doc.close()

print("MAIN PROFILE (Capex Construction & Engineering - Company Profile):")
dominant_colors(r"C:\Users\svans\OneDrive\Desktop\Capex Construction & Engineering — Company Profile.pdf", [1,2,4,10,13,17,21])
print("\nDOC12 (HVAC profile):")
dominant_colors(r"C:\Users\svans\OneDrive\Desktop\Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf", [1,2,8])
print("\nECGD (Electrical & CGD profile):")
dominant_colors(r"C:\Users\svans\OneDrive\Desktop\Capex Profile for Electrical and CGD (1).pdf", [1,2,8])
