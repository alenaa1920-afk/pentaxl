import path from "node:path"
import type { NextConfig } from "next"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })

const nextConfig: NextConfig = {
  // Pin tracing to this project. Without it Next walks up and finds an unrelated
  // lockfile in the home directory and infers the wrong workspace root.
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
}

export default withBundleAnalyzer(nextConfig)
