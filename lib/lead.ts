import { z } from "zod"
import { budgetOptions } from "@/content/site"
import { services } from "@/content/services"

/** Built from the real service list plus an escape hatch. */
export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "not-sure", label: "Not sure yet" },
]

const values = <T extends { value: string }>(list: T[]) =>
  list.map((o) => o.value) as [string, ...string[]]

/**
 * One schema for the client form and the server action, so the two can never disagree
 * about what valid means. Messages are written for the person who tripped them.
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is too long to store."),
  email: z
    .string()
    .trim()
    .min(1, "We need an email address to reply to.")
    .email("That does not look like an email address — check for a typo."),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is longer than expected.")
    .optional()
    .or(z.literal("")),
  service: z.enum(values(serviceOptions), {
    errorMap: () => ({ message: "Please choose which service you need." }),
  }),
  budget: z
    .enum(values(budgetOptions), { errorMap: () => ({ message: "Please choose a budget range." }) })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "A sentence or two more, please — enough to tell us what the problem is.")
    .max(4000, "That is longer than the form accepts. Send the essentials and we will ask."),
  /** Honeypot: invisible to people, so anything in it is a bot. */
  company_website: z.string().max(0).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
export type FieldName = keyof LeadInput

export type FormState = {
  status: "idle" | "success" | "error"
  errors?: Partial<Record<FieldName, string>>
  message?: string
  /** Echoed back so nothing typed is lost on error. */
  values?: Partial<Record<FieldName, string>>
}

/** Single-field check, for on-blur validation. */
export const validateField = (name: FieldName, value: string) => {
  const result = leadSchema.shape[name].safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}
