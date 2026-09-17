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
