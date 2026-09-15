import Link from "next/link"
import { Container } from "@/components/ui"
import { primaryNav } from "@/content/site"

export default function NotFound() {
  return (
    <div className="py-24">
      <Container>
        <p className="text-accent font-mono text-sm">404</p>
        <h1 className="max-w-measure mt-4 text-2xl md:text-3xl">That page does not exist</h1>
        <p className="max-w-measure text-muted mt-6 text-base md:text-lg">
          Either the address has a typo in it, or something moved and we did not redirect it
          properly. The second one is our fault.
        </p>
        <nav aria-label="Main sections" className="mt-12">
          <ul className="border-line border-t">
            {primaryNav.map((item) => (
              <li key={item.href} className="border-line border-b">
                <Link href={item.href} className="hover:text-accent block py-4 text-lg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  )
}
