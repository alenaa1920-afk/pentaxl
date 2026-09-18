"use client"

// Client for on-blur validation, pending state and the success view that replaces the
// form in place. Shares its schema with the server action.

import { useActionState, useId, useState } from "react"
import { validateField, serviceOptions, type FieldName, type FormState } from "@/lib/lead"
import { budgetOptions, site, RESPONSE_PROMISE } from "@/content/site"
import { SubmitButton } from "@/components/ui"
import { cn } from "@/lib/utils"
import { submitLead } from "./actions"

type Field = {
  name: FieldName
  label: string
  type?: "text" | "email" | "tel" | "textarea" | "select"
  hint?: string
  options?: { value: string; label: string }[]
  required?: boolean
  autoComplete?: string
}

const FIELDS: Field[] = [
  { name: "name", label: "Your name", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", hint: "Optional", autoComplete: "tel" },
  {
    name: "service",
    label: "What do you need",
    type: "select",
    options: serviceOptions,
    required: true,
  },
  {
    name: "budget",
    label: "Budget range",
    type: "select",
    options: budgetOptions,
    hint: "Optional, and it changes the conversation less than you would think",
  },
  {
    name: "message",
    label: "What are you trying to build",
    type: "textarea",
    hint: "A paragraph is plenty. The problem is more useful to us than a specification.",
    required: true,
  },
]

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, { status: "idle" } as FormState)
  const [blurred, setBlurred] = useState<Partial<Record<FieldName, string>>>({})
  const uid = useId()

  if (state.status === "success") {
    return (
      <div className="panel border-accent/40 p-8">
        <h2 className="text-xl">Your message is with us</h2>
        <p className="max-w-measure text-muted mt-4 text-base">
          We read everything that comes through this form ourselves. You will get a reply within{" "}
          {RESPONSE_PROMISE} — a real answer about whether we are the right firm for this, not an
          acknowledgement.
        </p>
      </div>
    )
  }

  const errorFor = (name: FieldName) => state.errors?.[name] ?? blurred[name]
  const onBlur = (name: FieldName) => (e: React.FocusEvent<HTMLElement & { value: string }>) =>
    setBlurred((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }))

  const box = (invalid: boolean) =>
    cn(
      "mt-3 w-full border bg-surface px-4 py-2 text-base transition-colors",
      invalid ? "border-gold" : "border-line focus:border-accent",
    )

  return (
    <form action={formAction} noValidate className="max-w-measure">
      {state.status === "error" && state.message ? (
        <p role="alert" className="border-gold/60 bg-gold/10 mb-8 border px-4 py-3 text-base">
          {state.message}{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
            {site.email}
          </a>
        </p>
      ) : null}

      <div className="space-y-8">
        {FIELDS.map((field) => {
          const id = `${uid}-${field.name}`
          const error = errorFor(field.name)
          const describedBy = error ? `${id}-error` : field.hint ? `${id}-hint` : undefined
          const shared = {
            id,
            name: field.name,
            required: field.required,
            defaultValue: state.values?.[field.name] ?? "",
            onBlur: onBlur(field.name),
            "aria-describedby": describedBy,
            "aria-invalid": error ? true : undefined,
            className: box(!!error),
          }

          return (
            <div key={field.name}>
              <label htmlFor={id} className="block text-base font-medium">
                {field.label}
                {field.required ? null : <span className="sr-only"> (optional)</span>}
              </label>
              {field.hint ? (
                <p id={`${id}-hint`} className="text-muted mt-1 text-sm">
                  {field.hint}
                </p>
              ) : null}

              {field.type === "textarea" ? (
                <textarea {...shared} rows={6} />
              ) : field.type === "select" ? (
                // Native select: fully accessible, platform picker on mobile, 0KB.
                <select {...shared}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...shared} type={field.type ?? "text"} autoComplete={field.autoComplete} />
              )}

              {error ? (
                <p id={`${id}-error`} className="text-gold mt-2 text-sm">
                  {error}
                </p>
              ) : null}
            </div>
          )
        })}

        {/* Honeypot: hidden from sight and assistive tech, never autofilled. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor={`${uid}-hp`}>Company website</label>
          <input id={`${uid}-hp`} name="company_website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-10">
        <SubmitButton pending={pending}>{pending ? "Sending" : "Send this"}</SubmitButton>
        <p className="text-muted mt-4 font-mono text-sm">We reply within {RESPONSE_PROMISE}.</p>
      </div>
    </form>
  )
}
