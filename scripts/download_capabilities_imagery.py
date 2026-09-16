"""Download + grade the Capabilities page's atmospheric reference frames
from Wikimedia Commons (same pipeline contract as the About/Contact/People
research scripts: single fixed HTTPS host, URLs strictly from the API's own
thumburl, resolve-and-block of private/loopback/link-local IPs (anti-SSRF),
no redirects). Frames are graded once toward the site's warm register —
split RGB -> r*1.045+6, g*1.005+2, b*0.93 -> Color 0.78 -> Contrast 1.03 —
then saved progressive JPEG long edge 1600, q76, into
public/uploads/capabilities/. All frames are third-party REFERENCE material;
public/uploads/capabilities/SOURCES.md is written alongside them."""
import json
import socket
import time
import urllib.parse
import urllib.request

ALLOWED_HOSTS = {"commons.wikimedia.org", "thumb.wikimedia.org", "upload.wikimedia.org"}
BASE_URL = "https://commons.wikimedia.org/w/api.php"
UA = "CapexSiteResearch/1.0 (editorial reference sourcing)"


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


# slug -> Commons File title
WANTED = {
    "cable-tunnel": "Amsteg - GBT Cable Tunnel (30934985901).jpg",
    "hdd-rig-drillto": "Moscow, Drillto ZT 45-90CDF drilling machine, Apr 2025 01.jpg",
    "sprinkler-ceiling": "Installation of fire protection sprinklers in the ceiling of the future LIRR passenger concourse. (CM014B, 10-31-2018) (30742926137).jpg",
    "cleanroom-lab": "Cleanroom (9148358991).jpg",
    "gas-trench": "Gas pipe trench in Shan Slieve Drive, Newcastle - geograph.org.uk - 6536707.jpg",
    "substation-build": "Denny Substation construction site, March 2017 - 32699572384.jpg",
}


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
        ii = (page.get("imageinfo") or [{}])[0]
        em = ii.get("extmetadata", {})
        artist_html = (em.get("Artist", {}) or {}).get("value", "?")
        # strip the html wrapper the API returns for Artist
        import re
        artist_text = re.sub(r"<[^>]+>", "", artist_html).strip() or "?"
        return {
            "title": page["title"],
            "thumburl": ii.get("thumburl", ""),
            "width": ii.get("width"),
            "height": ii.get("height"),
            "license": (em.get("LicenseShortName", {}) or {}).get("value", "?"),
            "artist": artist_text,
        }
    return None


def grade_and_save(src_bytes, dest_path):
    """One grade toward the site's warm register (the established recipe),
    then progressive JPEG long edge 1600, q76."""
    from io import BytesIO
    from PIL import Image, ImageEnhance

    im = Image.open(BytesIO(src_bytes)).convert("RGB")
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
    im.save(dest_path, "JPEG", quality=76, progressive=True, optimize=True)


def download_to(url, dest):
    _assert_public_https(url)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(req, timeout=120) as r:
        data = r.read()
    grade_and_save(data, dest)
    return len(data)


if __name__ == "__main__":
    import os
    out_dir = "public/uploads/capabilities"
    os.makedirs(out_dir, exist_ok=True)
    for slug, title in WANTED.items():
        meta = fetch_meta(title)
        if not meta or not meta["thumburl"]:
            print(f"!! no meta for {slug}")
            continue
        dest = f"{out_dir}/{slug}.jpg"
        nbytes = download_to(meta["thumburl"], dest)
        print(f"{slug}: {meta['license']} | {meta['artist'][:50]} | {nbytes} bytes -> {dest}")
        print(f"    source: {meta['title']}")
        time.sleep(0.5)
