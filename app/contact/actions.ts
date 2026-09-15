"use server"

import { headers } from "next/headers"
import { leadSchema, type FieldName, type FormState, type LeadInput } from "@/lib/lead"
import { site } from "@/content/site"

const FIELDS: FieldName[] = ["name", "email", "phone", "service", "budget", "message"]

/**
 * Fixed-window rate limit in process memory.
 *
 * Deviation from the brief's @upstash/ratelimit: that needs Redis credentials which do
 * not exist yet, and an unconfigured limiter fails open on every request. Memory is
 * per-instance, so on serverless the window resets when an instance recycles — fine for
 * stopping casual spam. Raised by the e2e suite via CONTACT_RATE_LIMIT_MAX.
 */
const WINDOW_MS = 60 * 60 * 1000
const MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5)
const hits = new Map<string, { count: number; resetAt: number }>()

function allow(key: string) {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  entry.count += 1
  if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
  return entry.count > MAX
    ? { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
    : { ok: true, retryAfter: 0 }
}

/**
 * Lead delivery, deliberately stubbed: the email is a placeholder with no mailbox, so a
 * live send would bounce and a form that looks like it worked but dropped the lead is
 * the worst failure available here.
 *
 * To go live: buy the mailbox, verify the domain in Resend, `pnpm add resend`, set
 * RESEND_API_KEY, set emailIsLive: true in content/site.ts, then replace this body with
 * the send and return { delivered: true }.
 */
async function deliver(lead: LeadInput) {
  if (!site.emailIsLive || !process.env.RESEND_API_KEY) {
    console.info("[lead] received, not delivered — no live mailbox", {
      name: lead.name,
      email: lead.email,
      service: lead.service,
      at: new Date().toISOString(),
    })
    return { delivered: false as const }
  }
  return { delivered: false as const }
}

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Partial<Record<FieldName, string>>

  const parsed = leadSchema.safeParse({
    ...values,
    company_website: String(formData.get("company_website") ?? ""),
  })

  if (!parsed.success) {
    const errors: Partial<Record<FieldName, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName
      // Honeypot tripped: report success to the bot rather than teaching it the rule.
      if (field === "company_website") return { status: "success" }
      errors[field] ??= issue.message
    }
    return { status: "error", errors, message: "Some details need another look.", values }
  }

  // Limited after validation so a malformed flood cannot burn a real user's quota.
  const ip = ((await headers()).get("x-forwarded-for") ?? "unknown").split(",")[0].trim()
  const limit = allow(ip)
  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfter / 60))
    return {
      status: "error",
      message: `That is several submissions from this connection. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}, or email us directly.`,
      values,
    }
  }

  try {
    const { delivered } = await deliver(parsed.data)
    if (delivered) return { status: "success" }
    return {
      status: "error",
      message:
        "The form is not delivering mail yet — our company mailbox is still being set up. " +
        "Please email us directly and we will reply the same way.",
      values,
    }
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending that. Try again, or email us directly.",
      values,
    }
  }
}
