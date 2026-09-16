# Capabilities — atmospheric reference imagery

All frames in this directory are **third-party reference/atmosphere imagery**,
not Capex project photography. They communicate the _discipline_ of each
capability (cable corridors, gas mains, substations, drilling rigs, clean
rooms, sprinklered ceilings…) and are always captioned as reference material
on the page — never presented as Capex-owned assets, projects or equipment.
Replace 1:1 by the same filename when approved Capex photography arrives.

| File                  | Subject                                                 | Commons source                                                                                                                         | Author                                             | License      |
| --------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------ |
| cable-tunnel.jpg      | Underground cable corridor with racks                   | "Amsteg - GBT Cable Tunnel (30934985901)"                                                                                              | Kecko                                              | CC BY 2.0    |
| gas-trench.jpg        | Gas main pipe laid in an open trench                    | "Gas pipe trench in Shan Slieve Drive, Newcastle - geograph.org.uk - 6536707"                                                          | Eric Jones                                         | CC BY-SA 2.0 |
| substation-build.jpg  | Substation under construction                           | "Denny Substation construction site, March 2017 - 32699572384"                                                                         | SounderBruce                                       | CC BY-SA 2.0 |
| hdd-rig-drillto.jpg   | Drillto HDD drilling machine on site                    | "Moscow, Drillto ZT 45-90CDF drilling machine, Apr 2025 01"                                                                            | Retired electrician                                | CC0          |
| sprinkler-ceiling.jpg | Fire-protection sprinklers being installed in a ceiling | "Installation of fire protection sprinklers in the ceiling of the future LIRR passenger concourse. (CM014B, 10-31-2018) (30742926137)" | MTA Capital Construction Mega Projects             | CC BY 2.0    |
| cleanroom-lab.jpg     | Cleanroom interior with HEPA-hooded ceiling             | "Cleanroom (9148358991)"                                                                                                               | UCL Mathematical and Physical Sciences from London | CC BY 2.0    |

## Notes

- Downloaded via the Commons API at 1920px (`scripts/download_capabilities_imagery.py`
  — same allowlisted-host / anti-SSRF / no-redirect contract as the About,
  Contact and People pipelines), then graded once toward the site's warm
  register (split RGB → r×1.045+6, g×1.005+2, b×0.93 → Color 0.78 →
  Contrast 1.03) and saved progressive JPEG long edge 1600, q76.
  Re-run that grade if a frame is replaced.
- **CC BY / CC BY-SA frames** require attribution if shipped long-term; they
  are placeholders until approved Capex photography lands (Phase 7 media
  gate). If any remain at launch, add a footer credit line or swap them out.
- **CC0 frames** (hdd-rig-drillto) need no attribution.
- Reference captions on the page always read "reference imagery — not a
  documented Capex project / not Capex-owned equipment", per the site-wide
  honesty rule.
