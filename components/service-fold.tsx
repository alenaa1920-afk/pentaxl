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

import Link from "next/link"
import { useState } from "react"
import { services } from "@/content/services"
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
      // items-start so a shut card is only as tall as its icon and word. The row would
      // otherwise reserve the open card's height in every tile, which reads as five
      // empty boxes. min-h holds the section's own height steady instead, so opening a
      // card never shoves the rest of the page down.
      className="grid items-start gap-3 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:min-h-[21rem] md:grid-cols-[var(--cols)]"
    >
      {services.map((service, i) => {
        const isOpen = i === open
        return (
          <li
            key={service.slug}
            className={cn(
              "panel flex flex-col overflow-hidden transition-colors duration-300",
              isOpen && "border-line-strong bg-surface-2",
            )}
          >
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
              // Guarded by pointer type so a touch tap does not also run this path.
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
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
