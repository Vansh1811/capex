# Clients — logo marquee assets

Third-party trademarks, stored locally for identification of the documented
client/company relationships on the /clients page only. Not owned by Capex;
do not modify, recolor or crop them. The former `/__l5e/assets-v1/…` Lovable
CDN paths 404 off-platform (Phase2 TD8), so assets live here now.

All assets obtained 2026-09-17 from each company's official website; identity
checked (spelling, wordmark, symbol, current brand version) before storing.
Geometry untouched; rasters larger than 640px were proportionally downsampled
only. CommScope's official asset is a JPEG on white; white was keyed to
transparency (pixel colors and geometry untouched) so it can sit on ivory.

| File                          | Company (slug)               | Source page                        | Asset source (official)                                                | Format |
| ----------------------------- | ---------------------------- | ---------------------------------- | ---------------------------------------------------------------------- | ------ |
| acquisory.png                 | Acquisory                    | https://www.acquisory.com/         | /Content/img/logo.png                                                   | PNG    |
| apollo-pipes.png              | Apollo Pipes (apl-apollo)    | https://www.apollopipes.com/       | /assets/front/img/apl-apollo-logo.png                                   | PNG    |
| bhutani-infra.png             | Bhutani Infra                | https://www.bhutanigroup.com/      | /front/img/logo.png                                                     | PNG    |
| bl-agro.png                   | B.L Agro                     | https://blagro.org/                | /wp-content/uploads/2025/09/vl-agro-website-logo.png                    | PNG    |
| bpcl.png                      | BPCL                         | https://www.bharatpetroleum.in/    | /images/BPCL_transparent_logo_new.png                                   | PNG    |
| capgemini.svg                 | Capgemini                    | https://www.capgemini.com/         | /wp-content/themes/capgemini2025/assets/images/capgeminiBlue.svg        | SVG    |
| commscope.png                 | CommScope                    | https://www.commscope.com/         | webresources.commscope.com/images/assets/commscope-logo/… (og:image)    | PNG    |
| imgc.png                      | IMGC                         | https://www.imgc.com/              | /wp-content/themes/imgc/images/logo.png                                 | PNG    |
| pearson-education.png         | Pearson Education India      | https://in.pearson.com/            | /etc/clientlibs/platform/aem-core/components/content/pearson-banner/…   | PNG    |
| softcell.png                  | Softcell                     | https://www.softcell.com/          | /media/images/essential/softcell_logo.png                               | PNG    |
| tata-advanced-systems.png     | TATA Advanced Systems        | https://www.tataadvancedsystems.com/ | /website/images/logo.png                                              | PNG    |
| tata-aig.svg                  | TATA AIG                     | https://www.tataaig.com/           | /TataAigLogoNew.svg                                                     | SVG    |
| ultratech.png                 | UltraTech                    | https://www.ultratechcement.com/   | header experience-fragment ultratech-cement-logo.png                    | PNG    |

## Notes

- SVG preferred where the official site ships SVG (Capgemini, TATA AIG).
- BPCL serves BGRL-era CGD works via its merged corporate identity; the
  registry's "BGRL" client is represented through BPCL's official mark.
- Every other exhibition client intentionally renders as its verified company
  name (text fallback) rather than an unverified or third-party logo.
- Hard failure of any image falls back to the same text name at render time.
- Correction: the "BGRL" registry client has NO mapped logo — only bpcl (BPCL)
  is mapped; BGRL is not represented by BPCL's mark in the marquee.

## Inventory (2026-09-18 audit)

Verified direct clients (CLIENT_CORPUS, relationship === "client"): 55.
Verified logo assets: 13. Client Index rows: 55 (text-only, no logos).
Logo marquee: all 13 verified assets (26 image instances with the duplicate
loop track). Companies without a verified asset are omitted from the marquee
and remain listed as text in the index — never fabricated.

| Company (CLIENT_CORPUS name)              | Category               | Logo asset                  | Verified logo | In marquee |
| ----------------------------------------- | ---------------------- | --------------------------- | ------------- | ---------- |
| Capgemini                                 | IT & Technology        | capgemini.svg               | YES           | YES        |
| CommScope                                 | IT & Technology        | commscope.png               | YES           | YES        |
| Invenio                                   | IT & Technology        | —                           | NO            | NO         |
| Arkadin                                   | IT & Technology        | —                           | NO            | NO         |
| AVNET                                     | IT & Technology        | —                           | NO            | NO         |
| APC                                       | IT & Technology        | —                           | NO            | NO         |
| Softcell                                  | IT & Technology        | softcell.png                | YES           | YES        |
| I-Avatar                                  | IT & Technology        | —                           | NO            | NO         |
| GEBTECH                                   | IT & Technology        | —                           | NO            | NO         |
| CHROME                                    | IT & Technology        | —                           | NO            | NO         |
| DEN                                       | IT & Technology        | —                           | NO            | NO         |
| Virus-Eraser                              | IT & Technology        | —                           | NO            | NO         |
| TATA Advanced Systems                     | Corporates             | tata-advanced-systems.png   | YES           | YES        |
| Qatar Airways                             | Corporates             | —                           | NO            | NO         |
| IMGC                                      | Corporates             | imgc.png                    | YES           | YES        |
| Regus                                     | Corporates             | —                           | NO            | NO         |
| Hexagramme                                | Corporates             | —                           | NO            | NO         |
| TATA AIG                                  | Corporates             | tata-aig.svg                | YES           | YES        |
| ICICI Lombard                             | Corporates             | —                           | NO            | NO         |
| Acquisory                                 | Corporates             | acquisory.png               | YES           | YES        |
| Ishaan International                      | Corporates             | —                           | NO            | NO         |
| V & S SeAir Logistics Pvt. Ltd            | Corporates             | —                           | NO            | NO         |
| Paperpedia                                | Corporates             | —                           | NO            | NO         |
| Rama Refrigeration                        | Corporates             | —                           | NO            | NO         |
| My Desk                                   | Corporates             | —                           | NO            | NO         |
| Aditya Birla Group                        | Corporates             | —                           | NO            | NO         |
| AON                                       | Corporates             | —                           | NO            | NO         |
| B.L Agro                                  | Corporates             | bl-agro.png                 | YES           | YES        |
| Singhi & Company                          | Corporates             | —                           | NO            | NO         |
| Sandhaar Eco Green                        | Corporates             | —                           | NO            | NO         |
| Kotak Securities                          | Corporates             | —                           | NO            | NO         |
| JCPenney                                  | Corporates             | —                           | NO            | NO         |
| Pearson Education India Pvt. Ltd.         | Corporates             | pearson-education.png       | YES           | YES        |
| Golder Associates                         | Corporates             | —                           | NO            | NO         |
| SS Foods                                  | Corporates             | —                           | NO            | NO         |
| BGRL                                      | Oil & Gas Industries   | —                           | NO            | NO         |
| IGL                                       | Oil & Gas Industries   | —                           | NO            | NO         |
| BPCL                                      | Oil & Gas Industries   | bpcl.png                    | YES           | YES        |
| Essar                                     | Oil & Gas Industries   | —                           | NO            | NO         |
| Apollo Pipes Limited                      | Oil & Gas Industries   | apollo-pipes.png            | YES           | YES        |
| UltraTech                                 | Oil & Gas Industries   | ultratech.png               | YES           | YES        |
| United Transformers                       | Oil & Gas Industries   | —                           | NO            | NO         |
| Prakash Group of Industries               | Oil & Gas Industries   | —                           | NO            | NO         |
| Elcon                                     | Oil & Gas Industries   | —                           | NO            | NO         |
| Nippon Steel & Sumitomo Metal             | Oil & Gas Industries   | —                           | NO            | NO         |
| L&T                                       | Builders & Developers  | —                           | NO            | NO         |
| JSP Projects Pvt. Ltd.                    | Builders & Developers  | —                           | NO            | NO         |
| TATA Projects                             | Builders & Developers  | —                           | NO            | NO         |
| Bhutani Infra                             | Builders & Developers  | bhutani-infra.png           | YES           | YES        |
| Creative LLP                              | Builders & Developers  | —                           | NO            | NO         |
| World Trade Tower                         | Builders & Developers  | —                           | NO            | NO         |
| World Trade Park                          | Builders & Developers  | —                           | NO            | NO         |
| Noida Towers Pvt. Ltd.                    | Builders & Developers  | —                           | NO            | NO         |
| Tricon Builcon                            | Builders & Developers  | —                           | NO            | NO         |
| Lakhani                                   | Builders & Developers  | —                           | NO            | NO         |

Totals: 55 verified direct clients (= Client Index rows) · 13 verified logo
assets · 13 logos in the marquee (26 rendered instances incl. duplicate
track). Marquee and index are intentionally different sets: marquee = every
client with a verified official logo asset; index = every verified client,
text-only. A failed logo image is omitted from the marquee, never replaced
by a fabricated wordmark.
