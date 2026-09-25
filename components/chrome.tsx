"use client"

// Client only for what needs the browser: the reveal observer, the current-route
// marker, and the drawer's focus management.

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Drawer } from "vaul"
import { Menu, X } from "lucide-react"
import { primaryNav, site } from "@/content/site"
import { Container, Action } from "./ui"
import { cn } from "@/lib/utils"

/**
 * Drives every `data-reveal` element on the page. One observer for the whole site
 * instead of a wrapper component per section — and if JS never runs, or the user asked
 * for reduced motion, `data-motion` is never set and the CSS leaves content visible.
 */
export function MotionRoot() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    root.dataset.motion = "on"

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-shown", "")
          io.unobserve(entry.target)
        }
      },
      // Only the bottom edge gates anything: an element counts as intersecting once its
      // top clears 12% above the fold. The enormous margins on the other three sides
      // are what stop content being stranded at opacity 0 forever — anything the
      // viewport jumped clean over (an anchor link, a restored scroll position, a fast
      // flick) never changes intersection state without them, so the observer would
      // simply never fire for it.
      { rootMargin: "100000px 100000px -12% 100000px", threshold: 0.05 },
    )

    document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el))

    // A rail is a scroll container, so it clips its own off-screen items out of every
    // intersection — rootMargin expands the root's rect and cannot reach past an
    // intermediate clip. Those items would sit invisible until dragged into view. So
    // the rail itself is what gets observed, and its items reveal with it; the stagger
    // still comes from each item's --reveal-delay, not from the order they fire in.
    const railObservers = [...document.querySelectorAll(".rail")].flatMap((rail) => {
      const items = [...rail.querySelectorAll("[data-reveal]:not([data-shown])")]
      if (!items.length) return []
      const railIo = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return
          railIo.disconnect()
          for (const item of items) item.setAttribute("data-shown", "")
        },
        { rootMargin: "100000px 100000px -12% 100000px", threshold: 0 },
      )
      railIo.observe(rail)
      return [railIo]
    })

    return () => {
      io.disconnect()
      for (const railIo of railObservers) railIo.disconnect()
    }
  }, [pathname])

  return null
}

/** Hides the site header and footer on /preview/* so a full-page component can be
 *  evaluated on its own. Children stay server-rendered; this only decides whether. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/preview")) return null
  return <>{children}</>
}

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // The shader runs behind every page now, so the header is transparent at rest and
  // lets it through — an opaque strip across the top read as a separate, static site.
  // Once you scroll it becomes glass, which is what keeps nav legible over content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-canvas/70 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="enter flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-xl tracking-tight md:text-2xl"
            aria-label={`${site.name} — home`}
          >
            {site.name}
            <span className="text-accent">.</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-1 text-base transition-colors",
                        active ? "text-accent" : "text-muted hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "bg-accent absolute -bottom-0.5 left-0 h-px transition-all duration-300",
                          active ? "w-full" : "w-0",
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <Drawer.Root>
            <Drawer.Trigger
              className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
              aria-label="Open menu"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="bg-canvas/70 fixed inset-0 z-50 backdrop-blur-sm" />
              <Drawer.Content
                aria-label="Menu"
                className="border-line bg-surface fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col border-t pb-8 outline-none"
              >
                <div className="border-line flex items-center justify-between border-b px-5 py-4">
                  <Drawer.Title className="font-display text-lg">Menu</Drawer.Title>
                  <Drawer.Close
                    className="inline-flex min-h-11 min-w-11 items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </Drawer.Close>
                </div>
                <nav aria-label="Primary" className="overflow-y-auto px-5">
                  <ul>
                    {primaryNav.map((item) => (
                      <li key={item.href} className="border-line border-b">
                        <Drawer.Close asChild>
                          <Link
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                            className={cn(
                              "flex min-h-14 items-center text-lg",
                              isActive(pathname, item.href) ? "text-accent" : "text-ink",
                            )}
                          >
                            {item.label}
                          </Link>
                        </Drawer.Close>
                      </li>
                    ))}
                  </ul>
                  {/* Primary action last, in thumb reach. */}
                  <Drawer.Close asChild>
                    <Action href="/contact" className="mt-6 w-full">
                      Start a project
                    </Action>
                  </Drawer.Close>
                </nav>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </Container>
      <div
        aria-hidden="true"
        className="scroll-progress bg-accent absolute inset-x-0 bottom-0 h-px origin-left"
      />
    </header>
  )
}
