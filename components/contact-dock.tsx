"use client"

// Floating contact launcher, bottom-right. Collapsed it is a single round button that
// bobs gently; expanded it reveals the direct routes plus the form.
//
// Behaviour notes: hidden on /contact (where it would be redundant), closes on Escape
// and on route change, returns focus to the trigger, and the bob stops under reduced
// motion. It sits above content but below the mobile nav drawer's overlay.

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Mail, MessageCircle, X } from "lucide-react"
import { site, whatsAppUrl } from "@/content/site"
import { cn } from "@/lib/utils"

export function ContactDock() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const whatsapp = whatsAppUrl()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  if (pathname === "/contact") return null

  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          id="contact-dock-panel"
          className="panel w-[min(20rem,calc(100vw-2rem))] origin-bottom-right p-5"
          style={{ animation: "rise-in 260ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <p className="font-display text-lg">Start a conversation</p>
          <p className="text-muted mt-2 text-sm">
            We reply within one working day, with a real answer about whether we are the right firm
            for it.
          </p>

          <div className="mt-5 grid gap-2">
            <Link
              href="/contact"
              className="bg-accent text-on-accent sheen inline-flex min-h-11 items-center justify-center px-4 text-base font-medium transition-[filter] hover:brightness-110"
            >
              Tell us about the project
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="border-line hover:border-accent hover:text-accent inline-flex min-h-11 items-center gap-2 border px-4 text-base transition-colors"
            >
              <Mail aria-hidden="true" className="size-4" />
              {site.email}
            </a>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line hover:border-accent hover:text-accent inline-flex min-h-11 items-center gap-2 border px-4 text-base transition-colors"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-dock-panel"
        aria-label={open ? "Close contact options" : "Contact us"}
        className={cn(
          "group relative inline-flex size-14 items-center justify-center rounded-full",
          "bg-accent text-on-accent shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--color-ink)_45%,transparent)]",
          "transition-transform duration-300 hover:scale-105",
          !open && "bob",
        )}
      >
        {/* A slow halo, so the button reads as live without demanding attention. */}
        {!open ? (
          <span
            aria-hidden="true"
            className="bg-accent ring-pulse absolute inset-0 -z-10 rounded-full"
          />
        ) : null}
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <MessageCircle aria-hidden="true" className="size-6" />
        )}
      </button>
    </div>
  )
}
