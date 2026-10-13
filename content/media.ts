/**
 * Media registry. Files live in public/media; provenance, photographer and licence for
 * every one of them is recorded in IMAGE_LICENSES.md at the repo root, which is also where the rules
 * for adding a new one are written down. Add the row in the same commit as the file.
 *
 * Every entry carries its own alt text, because alt belongs with the asset rather than
 * with whichever page happens to use it — the same photo used twice should not be
 * described two different ways.
 *
 * To swap one: drop a 2400x1350 JPG into public/media, change the path here, and update
 * the IMAGE_LICENSES.md row.
 */
type Media = { src: string; alt: string }

const entry = (file: string, alt: string): Media => ({ src: `/media/${file}`, alt })

export const media = {
  // — People doing the work ————————————————————————————————————————————
  team: entry(
    "team-collaboration.jpg",
    "Four engineers gathered around a monitor reviewing code together",
  ),
  whiteboard: entry(
    "whiteboard-architecture.jpg",
    "Three engineers working a system design out on a whiteboard",
  ),
  planning: entry(
    "team-planning.jpg",
    "A team planning a build against a wall of notes and diagrams",
  ),
  scoping: entry(
    "scoping-session.jpg",
    "Two people at desks in an open office working through a problem",
  ),
  engineer: entry(
    "engineer-at-monitor.jpg",
    "An engineer reading a wall of code on a large display",
  ),
  workstation: entry(
    "developer-workstation.jpg",
    "A developer at a dual-monitor workstation mid-build",
  ),

  // — Software ————————————————————————————————————————————————————————
  code: entry("code-on-screen.jpg", "Source code on a dark screen, syntax highlighted"),

  // — Infrastructure ——————————————————————————————————————————————————
  servers: entry("server-room.jpg", "Rows of server hardware lit blue and red in a data centre"),
  blades: entry(
    "server-blades.jpg",
    "A row of server blades with status lights running down the chassis",
  ),
  infrastructure: entry(
    "infrastructure.jpg",
    "Close-up of server racks and network cabling in a data centre",
  ),
  fibre: entry("fibre-optic-switch.jpg", "A fibre optic switch with every port patched"),
  patchPanel: entry(
    "network-patch-panel.jpg",
    "A network patch panel with cabling bundled across it",
  ),

  // — Silicon and data ————————————————————————————————————————————————
  gpu: entry("compute-gpu.jpg", "A high-performance GPU and its cooling fans, close up"),
  silicon: entry("silicon-chips.jpg", "Memory silicon and components on a circuit board, close up"),
  analytics: entry("data-visualisation.jpg", "A dense data visualisation on a dark display"),

  /**
   * The hero's full-bleed ground. Chosen to sit *under* the headline and the pentagon
   * rather than compete with them: real hardware, but dark, soft-focused and tonally
   * neutral, with no bright region for type to fight. A busier, more saturated crop was
   * tried here first and read as clutter behind the diagram.
   */
  heroGround: entry(
    "hero-rack.jpg",
    "A server rack photographed close up, falling away into shallow focus",
  ),

  // — Place ———————————————————————————————————————————————————————————
  office: entry("office-at-night.jpg", "An office building still lit at night"),
} as const

export type MediaKey = keyof typeof media

/**
 * One photograph per discipline, so a service reads as its own subject rather than as a
 * row in a list. Keyed by service slug; every slug in content/services.ts needs a row.
 */
export const serviceMedia: Record<string, Media> = {
  "software-development": media.workstation,
  "ai-and-ml-integration": media.gpu,
  "cloud-and-devops": media.blades,
  "security-and-compliance": media.fibre,
  "data-and-integrations": media.analytics,
}

/**
 * The film on /process. Stock b-roll from the same cottonbro studio shoot as `team`, so
 * the cast matches the photograph on the homepage. 1366x720 is the largest rendition
 * Pexels serves below 4K, and is sharp at the width it displays.
 */
export const engagementFilm = {
  src: "/media/engagement-review.mp4",
  poster: "/media/engagement-review-poster.jpg",
}
