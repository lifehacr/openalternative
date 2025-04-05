import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-default-domain.vercel.app"
const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

const nextConfig: NextConfig = {
  reactStrictMode: false,

  experimental: {
    ppr: true,
    useCache: true,

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 768, 1024],
    remotePatterns: [
      {
        hostname: `${process.env.S3_BUCKET || "example-bucket"}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`,
      },
    ],
  },

  async rewrites() {
    return [
      // RSS rewrites
      {
        source: "/rss.xml",
        destination: `${siteUrl}/rss/tools.xml`,
      },
      {
        source: "/alternatives/rss.xml",
        destination: `${siteUrl}/rss/alternatives.xml`,
      },

      // PostHog proxy (optional — can be removed if not using PostHog)
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogUrl.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogUrl}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogUrl}/decide`,
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/latest",
        destination: "/?sort=publishedAt.desc",
        permanent: true,
      },
      {
        source: "/topics",
        destination: "/topics/letter/a",
        permanent: true,
      },
      {
        source: "/languages/:path*",
        destination: "/stacks/:path*",
        permanent: true,
      },
      {
        source: "/licenses/:path*/tools",
        destination: "/licenses/:path*",
        permanent: true,
      },
      {
        source: "/newsletter",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sponsor",
        destination: "/advertise",
        permanent: true,
      },
      {
        source: "/categories/feedback-management",
        destination: "/categories/customer-feedback",
        permanent: true,
      },
    ]
  },
}

// @ts-expect-error
export default withContentCollections(nextConfig)
