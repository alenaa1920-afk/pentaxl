"use client"

// Horizontal range bars: each row is one entity, the bar spans its minimum to maximum.
//
// Encoding notes, for whoever changes this next:
// - Single hue, identity from the row label. Stage order is a sequence, not a
//   magnitude, so a sequential ramp would imply something untrue — and a 5-colour
//   categorical set cannot clear the CVD separation check on this surface anyway.
// - Grid and axis are deliberately recessive (1.2:1); the bar is 11:1.
// - Every bar carries its own value label, so colour is never the only channel, and
//   a real table sits underneath for screen readers and for copy-paste.

import { useState } from "react"
import { cn } from "@/lib/utils"

export type RangeItem = {
  label: string
  /** Shown under the label — the prose version of the same number. */
  note?: string
  min: number
  max: number
}

export function RangeChart({
  items,
  unit = "weeks",
  ticks,
  caption,
  emphasis,
}: {
  items: RangeItem[]
  unit?: string
  /** Axis ticks in the same unit. The last one sets the scale. */
  ticks: number[]
  caption: string
  /** Row index to draw in full accent — the rest sit in the dimmer track colour. */
  emphasis?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const scale = ticks[ticks.length - 1]
  const pct = (v: number) => (v / scale) * 100
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))

  return (
    <figure className="m-0">
      <div className="border-line relative border-t pt-6">
        {/* Recessive grid, drawn behind the bars. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-6 bottom-10 hidden sm:block">
          <div className="relative mr-20 ml-[11rem] h-full">
            {ticks.map((t) => (
              <span
                key={t}
                className="bg-line absolute top-0 bottom-0 w-px"
                style={{ left: `${pct(t)}%` }}
              />
            ))}
          </div>
        </div>

        <ul className="relative grid gap-3">
          {items.map((item, i) => {
            const isOn = active === i || emphasis === i
            return (
              <li
                key={item.label}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[11rem_1fr]"
              >
                <div className="min-w-0">
                  <p className={cn("text-base transition-colors", isOn && "text-accent")}>
                    {item.label}
                  </p>
                  {item.note ? <p className="text-muted font-mono text-sm">{item.note}</p> : null}
                </div>

                <div className="h-7 pr-20">
                  <div className="relative h-full">
                    <div
                      className={cn(
                        "absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[3px] transition-all duration-300",
                        isOn ? "bg-accent" : "bg-accent-dim",
                      )}
                      style={{ left: `${pct(item.min)}%`, width: `${pct(item.max - item.min)}%` }}
                    />
                    {/* Value label sits just past the bar, so no hover is needed to read it. */}
                    <span
                      className="text-muted absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-sm whitespace-nowrap tabular-nums"
                      style={{ left: `${pct(item.max)}%` }}
                    >
                      {fmt(item.min)}–{fmt(item.max)}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Axis */}
        <div aria-hidden="true" className="mt-4 hidden sm:block">
          <div className="relative mr-20 ml-[11rem] h-5">
            {ticks.map((t) => (
              <span
                key={t}
                className="text-muted absolute font-mono text-sm tabular-nums"
                style={{ left: `${pct(t)}%`, transform: "translateX(-50%)" }}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-muted mr-20 ml-[11rem] font-mono text-sm">{unit}</p>
        </div>
      </div>

      <figcaption className="text-muted max-w-measure mt-6 text-sm">{caption}</figcaption>

      <details className="mt-4">
        <summary className="text-accent glow cursor-pointer font-mono text-sm">
          View as a table
        </summary>
        <div className="border-line mt-3 overflow-x-auto border">
          <table className="w-full text-base">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-line border-b">
                <th scope="col" className="p-3 text-left font-medium">
                  Item
                </th>
                <th scope="col" className="p-3 text-left font-medium">
                  Shortest
                </th>
                <th scope="col" className="p-3 text-left font-medium">
                  Longest
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.label} className="border-line border-b last:border-0">
                  <th scope="row" className="p-3 text-left font-normal">
                    {item.label}
                  </th>
                  <td className="p-3 font-mono tabular-nums">
                    {fmt(item.min)} {unit}
                  </td>
                  <td className="p-3 font-mono tabular-nums">
                    {fmt(item.max)} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
