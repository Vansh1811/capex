"""Replace three weak Sectors atlas plates with stronger Commons frames
(same pipeline contract as scripts/download_capabilities_imagery.py: single
fixed HTTPS host, URLs strictly from the API's own thumburl, resolve-and-block
of private/loopback/link-local IPs (anti-SSRF), no redirects).

Frames are graded once toward the site's warm register — split RGB ->
r*1.045+6, g*1.005+2, b*0.93 -> Color 0.78 -> Contrast 1.03 — then saved
progressive JPEG long edge 1600, q76, plus a WebP sibling, into
public/uploads/sectors/. All frames are third-party REFERENCE material;
public/uploads/sectors/SOURCES.md is updated alongside them.

Replaces:
  corporate-commercial.jpg    (hazy Noida panorama)  -> Kolkata office tower
  industrial-manufacturing.jpg(barely-visible plant) -> yarn production line
  hotels-hospitality.jpg      (flower close-up)      -> grand hotel hall
"""
import json
import re
import socket
import time
import urllib.parse
import urllib.request

ALLOWED_HOSTS = {"commons.wikimedia.org", "thumb.wikimedia.org", "upload.wikimedia.org"}
BASE_URL = "https://commons.wikimedia.org/w/api.php"
UA = "CapexSiteResearch/1.0 (editorial reference sourcing)"

# dest filename -> (Commons File title, crop box or None, use_original)
# crop box is (left, top, right, bottom); when a crop is present the FULL
# original file is fetched so the box maps 1:1 to real pixels.
WANTED = {
    "corporate-commercial.jpg": (
        "Arch Water Front - An office building in Sector V area of Saltlake, Kolkata.jpg",
        (0, 1150, 2915, 3093),
        True,
    ),
    "industrial-manufacturing.jpg": (
        "POD Arselon yarn production line.jpg",
        None,
        False,
    ),
    "hotels-hospitality.jpg": (
        "Hall GDL.jpg",
        None,
        False,
    ),
}


def _assert_public_https(url: str) -> None:
    p = urllib.parse.urlparse(url)
    if p.scheme != "https":
        raise ValueError("https only")
    if p.hostname not in ALLOWED_HOSTS:
        raise ValueError(f"host not allowlisted: {p.hostname}")
    infos = socket.getaddrinfo(p.hostname, 443, proto=socket.IPPROTO_TCP)
    for info in infos:
        ip = info[4][0]
        if (ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168.")
                or ip.startswith("169.254.") or ip == "::1" or ip.startswith("fe80:")
                or ip.startswith("fc") or ip.startswith("fd")):
            raise ValueError(f"resolved to non-public address: {ip}")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def api(params):
    q = urllib.parse.urlencode(params)
    url = f"{BASE_URL}?{q}"
    _assert_public_https(url)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(req, timeout=60) as r:
        return json.load(r)


def fetch_meta(title):
    d = api({
        "action": "query", "format": "json",
        "titles": f"File:{title}",
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 1920,
    })
    pages = d.get("query", {}).get("pages", {}) or {}
    for pid, page in pages.items():
        if "imageinfo" not in page:
            return None
        ii = page["imageinfo"][0]
        em = ii.get("extmetadata", {})
        artist_html = (em.get("Artist", {}) or {}).get("value", "?")
        artist_text = re.sub(r"<[^>]+>", "", artist_html).strip() or "?"
        return {
            "title": page["title"],
            "thumburl": ii.get("thumburl", ""),
            "url": ii.get("url", ""),
            "width": ii.get("width"),
            "height": ii.get("height"),
            "license": (em.get("LicenseShortName", {}) or {}).get("value", "?"),
            "artist": artist_text,
        }
    return None


def grade_and_save(src_bytes, dest_path, crop):
    from io import BytesIO
    from PIL import Image, ImageEnhance

    im = Image.open(BytesIO(src_bytes)).convert("RGB")
    if crop:
        im = im.crop(crop)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.045) + 6))
    g = g.point(lambda v: min(255, int(v * 1.005) + 2))
    b = b.point(lambda v: int(v * 0.93))
    im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Color(im).enhance(0.78)
    im = ImageEnhance.Contrast(im).enhance(1.03)
    w, h = im.size
    scale = 1600 / max(w, h)
    if scale < 1:
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    im.save(dest_path, "JPEG", quality=72, progressive=True, optimize=True)
    im.save(dest_path.rsplit(".", 1)[0] + ".webp", "WEBP", quality=72, method=6)
    return im.size


def download_to(url, dest, crop):
    _assert_public_https(url)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(req, timeout=120) as r:
        data = r.read()
    return grade_and_save(data, dest, crop), len(data)


if __name__ == "__main__":
    import os
    out_dir = "public/uploads/sectors"
    os.makedirs(out_dir, exist_ok=True)
    for name, (title, crop, use_original) in WANTED.items():
        meta = fetch_meta(title)
        src = (meta or {}).get("url") if use_original else (meta or {}).get("thumburl")
        if not meta or not src:
            print(f"!! no meta for {name}")
            continue
        dest = os.path.join(out_dir, name)
        size, nbytes = download_to(src, dest, crop)
        print(f"{name}: {size} | {meta['license']} | {meta['artist'][:50]} | {nbytes} bytes")
        print(f"    source: {meta['title']}")
        time.sleep(0.5)
