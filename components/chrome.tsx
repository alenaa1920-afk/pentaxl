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

/** Contact is the header's button, so it is not also a plain link beside it. The 404 page
 *  still lists it, which is why it stays in primaryNav itself. */
const headerLinks = primaryNav.filter((item) => item.href !== "/contact")

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // A floating bar rather than a strip: detached from the top edge, rounded, no rule
  // under it. Over the hero it is barely there — a light frost on the photograph — and
  // once the page scrolls under it, it darkens just enough that the links stay legible
  // over body text.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    // pt-2 + h-14 and md:pt-4 + md:h-16 keep the header's footprint at 64 / 80px, which
    // the home hero's negative margin is sized to.
    <header className="sticky top-0 z-40 pt-2 md:pt-4">
      <Container>
        <div
          className={cn(
            "enter flex h-14 items-center justify-between gap-6 rounded-2xl px-4 backdrop-blur-md transition-colors duration-300 md:h-16 md:px-6",
            scrolled
              ? "bg-[#0b0a22]/60 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]"
              : "bg-white/[0.04]",
          )}
        >
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight md:text-[1.75rem]"
            aria-label={`${site.name} — home`}
          >
            {site.name}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {headerLinks.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "py-1 text-base font-semibold tracking-wide transition-colors",
                        active ? "text-accent" : "text-ink hover:text-accent",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Action
                  href="/contact"
                  className="min-h-10 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Start a project
                </Action>
              </li>
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
                    {headerLinks.map((item) => (
                      <li key={item.href} className="border-line border-b">
                        <Drawer.Close asChild>
                          <Link
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                            className={cn(
                              "flex min-h-14 items-center text-lg font-semibold",
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
                    <Action href="/contact" className="mt-6 w-full rounded-full">
                      Start a project
                    </Action>
                  </Drawer.Close>
                </nav>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </Container>
    </header>
  )
}
