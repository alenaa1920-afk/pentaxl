/**
 * Media registry. Files live in public/media.
 *
 * All photography is from Pexels under the Pexels licence: free for commercial use,
 * no attribution required, may not be resold unaltered or used to imply endorsement by
 * the people depicted. Credits are recorded anyway — it is good manners and it makes
 * replacing an asset traceable.
 *
 * To swap one: drop a 2400x1350 JPG into public/media and change the path here.
 */
export const media = {
  team: {
    src: "/media/team-collaboration.jpg",
    alt: "Four engineers gathered around a monitor reviewing code together",
    credit: "Pexels · photo 6804071",
  },
  servers: {
    src: "/media/server-room.jpg",
    alt: "Rows of server hardware lit blue and red in a data centre",
    credit: "Pexels · photo 17489151",
  },
  scoping: {
    src: "/media/scoping-session.jpg",
    alt: "Two people at desks in an open office working through a problem",
    credit: "Pexels · photo 6804068",
  },
  infrastructure: {
    src: "/media/infrastructure.jpg",
    alt: "Close-up of server racks and network cabling in a data centre",
    credit: "Pexels · photo 37730212",
  },
} as const

export type MediaKey = keyof typeof media
