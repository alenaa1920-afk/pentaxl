"use client"

// Five placards that stay shut until you ask. Collapsed, each is an icon and one word;
// the one you point at unfolds and shows its detail. The landing page therefore carries
// no wall of service copy — the full text still lives on each service page.
//
// The fold is a single transition on the container's grid-template-columns rather than
// five width transitions: one animated property on one element. The detail inside each
// card has a fixed width and is revealed with opacity and a rotateY hinge, both of
// which the compositor handles, so the only layout work per frame is the one column
// track resizing.
//
// Pointer opens on hover, keyboard on focus, touch on tap — all three set the same
// state, so nothing here is reachable by mouse alone. Below md the cards stack and
// unfold downwards instead, using the 0fr/1fr grid-rows trick so the height animates
// without measuring anything.

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { services } from "@/content/services"
import { serviceMedia } from "@/content/media"
import { ServiceIcon } from "./service-icon"
import { cn } from "@/lib/utils"

/** How much wider the open card is than a shut one. */
const OPEN_FR = 2.6

export function ServiceFold() {
  const [open, setOpen] = useState<number | null>(null)

  const columns = services.map((_, i) => (i === open ? `${OPEN_FR}fr` : "1fr")).join(" ")

  return (
    <ul
      style={{ "--cols": columns } as React.CSSProperties}
      // Pointer-type guarded, like the enter handler. A touch tap synthesises a
      // mouseenter and then a mouseleave on this element a few milliseconds later, so
      // an unguarded onMouseLeave shut the card the tap had just opened — fast enough
      // that it looked like the tap had done nothing at all.
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
      // Equal-height tiles, not content-height ones. Sized to the open card so the row
      // is the same shape before and after a fold, and so five shut cards read as one
      // band rather than as five small boxes adrift in a tall empty region.
      className="grid gap-3 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[23rem] md:grid-cols-[var(--cols)]"
    >
      {services.map((service, i) => {
        const isOpen = i === open
        return (
          <li
            key={service.slug}
            // Hover anywhere on the tile, not just on the icon and word. The button
            // keeps click and focus, because that is what a screen reader and a
            // keyboard need to land on; a pointer should not have to find it.
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
            className={cn(
              // Content centred as a block: the icon and word sit in the middle of a
              // shut tile, and the detail unfolds around them rather than pushing them
              // off an edge.
              "panel relative flex flex-col justify-center overflow-hidden [backdrop-filter:none] transition-colors duration-300",
              isOpen && "border-line-strong",
            )}
          >
            {/* The discipline's own photograph, deliberately well under the type: it is
                texture that says what the card is about, not a picture to look at. It
                lifts a little as the card opens, which is what makes the fold feel like
                the tile itself expanding rather than a text block appearing. */}
            <Image
              src={serviceMedia[service.slug].src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className={cn(
                "-z-20 object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen ? "scale-105 opacity-65" : "scale-100 opacity-40",
              )}
            />
            {/* The scrim deepens as the card opens. A shut tile carries only its icon
                and one word in white, so it can afford a light scrim and a clearly
                visible picture; an open one puts muted body text over the same
                photograph, and at the lighter setting that measured 4.1:1, under AA. */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -z-10 bg-gradient-to-t transition-colors duration-500",
                isOpen
                  ? "from-[#07061afa] via-[#07061ae8] to-[#07061ac4]"
                  : "from-[#07061ae6] via-[#07061abf] to-[#07061a8c]",
              )}
            />

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`fold-${service.slug}`}
              // Open, never toggle. A tap fires focus before click, so a toggle here
              // would open the card on focus and immediately shut it again on the same
              // tap — the card was unopenable by touch. Closing is the pointer leaving
              // the row, or another card opening; there is nothing a card can be left
              // covering, so there is nothing to dismiss.
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              className="flex min-h-11 shrink-0 items-center gap-3 p-5 text-left md:flex-col md:gap-4 md:text-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 transition-colors duration-300",
                  isOpen ? "text-accent-2" : "text-accent",
                )}
              >
                <ServiceIcon slug={service.slug} className="size-7" />
              </span>
              <span className="font-mono text-sm whitespace-nowrap">{service.nodeLabel}</span>
            </button>

            <div
              id={`fold-${service.slug}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              {/* min-h-0 is what lets the 0fr row actually collapse to nothing. */}
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cn(
                    "origin-left px-5 pb-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-[19rem]",
                    isOpen
                      ? "[transform:none] opacity-100"
                      : "pointer-events-none [transform:perspective(900px)_rotateY(-28deg)] opacity-0",
                  )}
                >
                  <h3 className="text-xl">{service.name}</h3>
                  <p className="text-muted mt-3 text-base">{service.summary}</p>
                  <p className="gradient-text font-display mt-5 text-2xl">
                    {service.weeks[0]}–{service.weeks[1]}
                    <span className="text-muted font-sans text-base"> weeks</span>
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    tabIndex={isOpen ? undefined : -1}
                    className="text-accent decoration-accent/30 hover:decoration-accent mt-6 inline-block font-mono text-sm underline underline-offset-[6px]"
                  >
                    Full detail
                  </Link>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
