"use client"

// The "Start your project" dialog. One native <dialog>, mounted once in the
// layout: the browser supplies the focus trap, Escape to close, the backdrop, inert
// page content behind it and focus returned to the trigger afterwards.
//
// It opens from any element carrying data-project-dialog. Those triggers are ordinary
// links to /contact, so without JavaScript — or with a modifier key, to open in a new
// tab — they still go to the full contact page. On /contact itself it stays out of the
// way: that page already is the form.
//
// The form inside is the contact page's own ContactForm, cut down to four fields, so
// both share one schema, one server action and one honest delivery message.

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { ContactForm } from "@/app/contact/form"
import { RESPONSE_PROMISE } from "@/content/site"

export function ProjectDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const trigger = (e.target as Element | null)?.closest<HTMLElement>("[data-project-dialog]")
      // No dialog on /contact (see below), so the link there just navigates.
      if (!trigger || !ref.current) return
      e.preventDefault()
      ref.current.showModal()
    }
    // Capture phase, not bubble. A trigger is a Next <Link>, whose own click handler
    // runs first in the bubble phase, calls preventDefault and starts navigating — so a
    // bubbling listener here only ever saw an already-handled event and stepped aside.
    // Catching it on the way down and preventing default first is what makes the Link
    // stand down instead (it checks defaultPrevented before navigating).
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  const close = () => ref.current?.close()

  // Not rendered at all on /contact: that page already is the form, and a second,
  // hidden copy of the same fields beside it is just a duplicate for every label.
  if (pathname === "/contact") return null

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      // A click that lands on the <dialog> element itself is a click on the backdrop:
      // the content fills the box, so anything inside hits a descendant instead.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="project-dialog border-line text-ink m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border bg-[#0d0b24] p-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="text-muted hover:text-ink absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full transition-colors"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <h2 id="project-dialog-title" className="pr-10 text-xl md:text-2xl">
          Start your project
        </h2>
        <p className="text-muted mt-3 text-base">
          Tell us what you are building. A real engineer reads it and replies within{" "}
          {RESPONSE_PROMISE}.
        </p>

        <div className="mt-7">
          <ContactForm compact only={["name", "email", "service", "message"]} />
        </div>
      </div>
    </dialog>
  )
}
