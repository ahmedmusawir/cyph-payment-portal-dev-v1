/** @type {import('next').NextConfig} */
// APBM-007B: non-secret build identity, compiled in at build time by scripts/apbm007b/build-check.mjs and exposed only
// through the read-only /api/build-info route (app, revision, artifact id). No credential is ever placed here.
const nextConfig = {
  env: {
    APBM_BUILD_ARTIFACT_ID: process.env.APBM_BUILD_ARTIFACT_ID || "unlabelled-build",
    APBM_BUILD_REVISION: process.env.APBM_BUILD_REVISION || "unrecorded",
  },
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
