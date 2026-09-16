"""Research only: query the Wikimedia Commons API for quiet, architectural /
engineering reference frames for the Contact page (THE OPEN LINE). Same
pipeline contract as research_people_imagery.py — single fixed HTTPS host,
URLs strictly from the API's own returned thumburl, resolve-and-block of
private/loopback/link-local IPs (anti-SSRF), no redirects, candidates
printed for manual triage; nothing is copied into public/ by this script."""
import json
import socket
import time
import urllib.parse
import urllib.request

ALLOWED_HOST = "commons.wikimedia.org"
BASE_URL = f"https://{ALLOWED_HOST}/w/api.php"
UA = "CapexSiteResearch/1.0 (editorial reference sourcing)"


def _assert_public_https(url: str) -> None:
    p = urllib.parse.urlparse(url)
    if p.scheme != "https":
        raise ValueError("https only")
    if p.hostname != ALLOWED_HOST:
        raise ValueError(f"host not allowlisted: {p.hostname}")
    infos = socket.getaddrinfo(p.hostname, 443, proto=socket.IPPROTO_TCP)
    for info in infos:
        ip = info[4][0]
        if (
            ip.startswith("127.")
            or ip.startswith("10.")
            or ip.startswith("192.168.")
            or ip.startswith("169.254.")
            or ip == "::1"
            or ip.startswith("fe80:")
            or ip.startswith("fc")
            or ip.startswith("fd")
        ):
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
    with opener.open(req, timeout=30) as r:
        return json.load(r)


def search(term, limit=8):
    return api({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{term} filetype:bitmap",
        "gsrnamespace": "6",
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": "1600",
    })


TERMS = [
    "underground utility tunnel pipes",
    "pipeline trench construction quiet",
    "cable trench substation",
    "plant room pipes quiet",
    "ductwork industrial interior",
    "engineer blueprint site meeting",
]

for term in TERMS:
    print(f"\n=== {term} ===")
    try:
        data = search(term)
    except Exception as e:
        print("error:", e)
        continue
    for page in (data.get("query", {}).get("pages", {}) or {}).values():
        ii = (page.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "?")
        w, h = ii.get("width", 0), ii.get("height", 0)
        print(f"- {page.get('title')}")
        print(f"  {w}x{h} · {lic} · {ii.get('thumburl', '')[:120]}")
    time.sleep(1)
