import pymupdf

# Check whether the visually rich pages have ANY text spans (maybe as vector/curves) or images
jobs = [
    (r"C:\Users\svans\OneDrive\Desktop\Capex Construction & Engineering — Company Profile.pdf", "main", [1,6,12,18,19,20,21]),
    (r"C:\Users\svans\OneDrive\Desktop\Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf", "doc12", [1,11,12,13]),
    (r"C:\Users\svans\OneDrive\Desktop\Capex Profile for Electrical and CGD (1).pdf", "ecgd", [1,5,9,19]),
]
for src, tag, pages in jobs:
    print(f"### {tag}")
    doc = pymupdf.open(src)
    for p in pages:
        if p-1 >= doc.page_count: continue
        page = doc[p-1]
        words = page.get_text("words")
        imgs = page.get_images(full=True)
        drawings = page.get_drawings()
        print(f"  p{p}: words={len(words)} images={len(imgs)} drawings={len(drawings)}")
        if words and p in (6, 1):
            # print any words found on cover/client pages
            for w in words[:30]:
                print("     word:", w[4])
    doc.close()
