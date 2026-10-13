# Image licences

Every externally sourced image on this site, with its provenance. Nothing here may be
replaced with an image from Google Images, a random URL, a paid stock library
(Shutterstock, Getty, Adobe Stock), or any file carrying a visible watermark.

## Sourcing rules

- Approved providers only: **Pexels**, **Unsplash**, **Pixabay**, or another explicitly
  approved free-stock provider.
- Prefer Pexels or Unsplash for photography.
- Every image must be cleared for commercial use under the provider's current licence.
- No hotlinking. Assets are downloaded and served from `public/media`, so the site does
  not depend on a third party staying up or keeping a URL stable.
- Add a row here in the same commit that adds the file. An image with no row is a bug.

## Licence in force

All photography below is from [Pexels](https://www.pexels.com) under the
[Pexels licence](https://www.pexels.com/license/): free for commercial use, attribution
not required, modification permitted. Prohibited: reselling unaltered copies, and
implying that a depicted person or brand endorses this company. Photographers are
credited anyway — it is good manners, and it makes an asset traceable when it is
replaced.

**No credit is shown on the site itself.** Neither the Pexels nor the Unsplash
licence requires on-page attribution, and a credit line on every photograph read as
clutter. This file is the record instead — keep it complete.

Downloaded 2026-09-25 (rows marked †: 2026-09-19), via the Pexels CDN at
`?auto=compress&cs=tinysrgb&w=2400&h=1350&fit=crop`, then served through `next/image`,
which re-encodes to AVIF or WebP per request.

| File                          | Subject                                            | Photographer                 | Source URL                             |
| ----------------------------- | -------------------------------------------------- | ---------------------------- | -------------------------------------- |
| `hero-rack.jpg`               | Server rack in shallow focus (hero ground)         | cookiecutter                 | https://www.pexels.com/photo/37605910/ |
| `server-blades.jpg`           | Server blades with status LEDs                     | cookiecutter                 | https://www.pexels.com/photo/1148820/  |
| `fibre-optic-switch.jpg`      | Fibre optic switch, patched                        | Brett Sayles                 | https://www.pexels.com/photo/4497197/  |
| `network-patch-panel.jpg`     | Network patch panel and cabling                    | Brett Sayles                 | https://www.pexels.com/photo/5087172/  |
| `silicon-chips.jpg`           | Circuit board and memory silicon, macro            | Jakub Pabis                  | https://www.pexels.com/photo/36169774/ |
| `engineer-at-monitor.jpg`     | Engineer reading code on a large display           | ThisIsEngineering            | https://www.pexels.com/photo/3861951/  |
| `developer-workstation.jpg`   | Developer at a dual-monitor workstation            | Zayed Hossain                | https://www.pexels.com/photo/36706459/ |
| `compute-gpu.jpg`             | High-performance GPU and cooling fans              | Planka                       | https://www.pexels.com/photo/35569901/ |
| `code-on-screen.jpg`          | Source code on a dark screen                       | Nemuel Sereti                | https://www.pexels.com/photo/6424583/  |
| `whiteboard-architecture.jpg` | Engineers working through a design at a whiteboard | ThisIsEngineering            | https://www.pexels.com/photo/3913021/  |
| `team-planning.jpg`           | Team planning against a wall of notes              | ThisIsEngineering            | https://www.pexels.com/photo/3912478/  |
| `data-visualisation.jpg`      | Data visualisation on a dark display               | Thales13                     | https://www.pexels.com/photo/38808473/ |
| `office-at-night.jpg`         | Office building lit at night                       | Pexels contributor 227888035 | https://www.pexels.com/photo/12837026/ |
| `team-collaboration.jpg` †    | Engineers reviewing code together                  | cottonbro studio             | https://www.pexels.com/photo/6804071/  |
| `server-room.jpg` †           | Server hardware lit blue and red                   | cookiecutter                 | https://www.pexels.com/photo/17489151/ |
| `scoping-session.jpg` †       | Two people working through a problem at desks      | cottonbro studio             | https://www.pexels.com/photo/6804068/  |
| `infrastructure.jpg` †        | Server racks and network cabling                   | cookiecutter                 | https://www.pexels.com/photo/37730212/ |

## Video

Same licence as the photography above (the Pexels licence covers video identically).
Downloaded 2026-10-13 from the Pexels CDN, at the 1366×720 rendition — the largest below
4K, and sharp at the width it is shown. Served as a static file from `public/media`;
the poster frame is Pexels' own.

| File                           | Subject                                                                             | Creator          | Source URL                            |
| ------------------------------ | ----------------------------------------------------------------------------------- | ---------------- | ------------------------------------- |
| `engagement-review.mp4`        | Engineers gathered round a developer reviewing code mid-build (22 s, muted, looped) | cottonbro studio | https://www.pexels.com/video/6804110/ |
| `engagement-review-poster.jpg` | Poster frame for the above                                                          | cottonbro studio | https://www.pexels.com/video/6804110/ |

Pexels serves video downloads without an API key (an earlier note here said otherwise;
it was wrong). Unsplash has no video library, so its API key would not help with video.
