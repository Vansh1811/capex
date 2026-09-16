"""Research only: query the Wikimedia Commons API for CC0/public-domain human
engineering reference frames for the People page. The host is fixed to
commons.wikimedia.org (HTTPS only) and the URL is built strictly from the
API's own returned thumburl — no user-supplied host ever enters a request —
so there is no server-side request surface beyond the fixed Wikimedia API
host. Candidate URLs are printed for manual download triage; nothing is
copied into public/ by this script."""
import json
import os
import time
import urllib.parse
import urllib.request

ALLOWED_HOST = "commons.wikimedia.org"
BASE_URL = f"https://{ALLOWED_HOST}/w/api.php"
UA = "CapexSiteResearch/1.0 (editorial reference sourcing)"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# resolved absolute destination root — realpath collapses any ../ before use;
# every write is verified to stay inside this directory.
OUT = os.path.realpath(os.path.join(SCRIPT_DIR, "..", "output", "wm-candidates"))


def safe_dest(name: str) -> str:
    """Join and verify the final path stays inside OUT (no traversal)."""
    dest = os.path.realpath(os.path.join(OUT, name))
    if os.path.commonpath([dest, OUT]) != OUT:
        raise ValueError(f"path escapes output root: {name}")
    return dest


def api(params):
    q = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{BASE_URL}?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def search(term, limit=10):
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
    "India construction labourer work",
    "indian worker factory",
    "technician laptop industrial plant",
]

TITLES = {
    "Theresagreenfield - 50342645227.jpg": "cand-greenfield.jpg",
    "US Army 52905 Brigade anticipates move into new building.jpg": "cand-brigade.jpg",
    "Construction Worker DVIDS85544.jpg": "cand-dvids.jpg",
}

ALLOWED_HOSTS = {ALLOWED_HOST, "upload.wikimedia.org", "thumb.wikimedia.org"}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def guarded_open(url: str) -> bytes:
    p = urllib.parse.urlparse(url)
    if p.scheme != "https" or p.hostname not in ALLOWED_HOSTS:
        raise ValueError(f"blocked non-allowlisted URL: {url}")
    clean = urllib.parse.urlunparse(("https", p.hostname, p.path, "", "", ""))
    req = urllib.request.Request(clean, headers={"User-Agent": UA})
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(req, timeout=60) as r:
        return r.read()


os.makedirs(OUT, exist_ok=True)
for title, name in TITLES.items():
    dest = safe_dest(name)
    if os.path.exists(dest):
        print(name, "already present")
        continue
    try:
        d = api({
            "action": "query",
            "format": "json",
            "titles": f"File:{title}",
            "prop": "imageinfo",
            "iiprop": "url|size|mime",
            "iiurlwidth": "1600",
        })
        pages = (d.get("query", {}) or {}).get("pages", {})
        ii = (next(iter(pages.values())).get("imageinfo") or [{}])[0]
        url = ii.get("thumburl") or ii.get("url")
        data = guarded_open(url)
        with open(dest, "wb") as f:
            f.write(data)
        print(name, ii.get("width"), "x", ii.get("height"), f"{len(data)//1024} KB")
    except Exception as e:
        print(name, "ERR", repr(e)[:120])
    time.sleep(8)
