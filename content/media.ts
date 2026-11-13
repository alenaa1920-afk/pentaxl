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
  whiteboard: entry(
    "whiteboard-architecture.jpg",
    "Three engineers working a system design out on a whiteboard",
  ),
  planning: entry(
    "team-planning.jpg",
    "A team planning a build against a wall of notes and diagrams",
  ),
  engineer: entry(
    "engineer-at-monitor.jpg",
    "An engineer reading a wall of code on a large display",
  ),

  // — Software ————————————————————————————————————————————————————————
  code: entry("code-on-screen.jpg", "Source code on a dark screen, syntax highlighted"),

  // — Infrastructure ——————————————————————————————————————————————————
  blades: entry(
    "server-blades.jpg",
    "A row of server blades with status lights running down the chassis",
  ),
  fibre: entry("fibre-optic-switch.jpg", "A fibre optic switch with every port patched"),

  // — Silicon and data ————————————————————————————————————————————————
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

  // — Livelier picks (2026-11 feedback: brighter, more colour, more people) ————
  teamBright: entry(
    "team-bright.jpg",
    "A team gathered round a table in a bright office, working through a project on laptops",
  ),
  aiLanguage: entry(
    "ai-language-models.jpg",
    "Glowing arches of streaming code — an artist's illustration of language models",
  ),
  aiNeural: entry(
    "ai-neural.jpg",
    "Glass spheres bursting outward on blue — an artist's illustration of adaptable AI",
  ),

  // — Place ———————————————————————————————————————————————————————————
  office: entry("office-at-night.jpg", "An office building still lit at night"),
} as const

/**
 * One photograph per discipline, so a service reads as its own subject rather than as a
 * row in a list. Keyed by service slug; every slug in content/services.ts needs a row.
 */
export const serviceMedia: Record<string, Media> = {
  "software-development": media.aiLanguage,
  "ai-and-ml-integration": media.aiNeural,
  "cloud-and-devops": media.blades,
  "security-and-compliance": media.fibre,
  "data-and-integrations": media.analytics,
}

/** One photograph per delivery stage, in `processStages` order (the /process carousel). */
export const stageMedia: Media[] = [
  entry("stage-idea.jpg", "A team brainstorming with sticky notes on a glass wall"),
  entry(
    "stage-design.jpg",
    "Translucent blue and violet blocks streaming through space — an illustration of neural network inputs and outputs",
  ),
  entry("stage-scope.jpg", "Colleagues smiling as they agree a plan around a laptop"),
  entry("stage-delivery.jpg", "A team building together around laptops in a colourful office"),
  entry("stage-launch.jpg", "A team celebrating a launch at their desks"),
]

/**
 * The film on /process. Stock b-roll from cottonbro studio. 1366x720 is the largest
 * rendition Pexels serves below 4K, and is sharp at the width it displays.
 */
export const engagementFilm = {
  src: "/media/engagement-review.mp4",
  poster: "/media/engagement-review-poster.jpg",
}
