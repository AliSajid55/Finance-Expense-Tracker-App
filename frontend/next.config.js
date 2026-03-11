/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async rewrites() {
    return [
      // These collection-root endpoints trigger a 307 trailing-slash redirect
      // on FastAPI, which bypasses the proxy and causes a CORS error in the
      // browser. Pointing directly to the slash version avoids the redirect.
      {
        source: "/api/v1/categories",
        destination: "http://localhost:8000/categories/",
      },
      {
        source: "/api/v1/expenses",
        destination: "http://localhost:8000/expenses/",
      },
      // General catch-all for all other API routes
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ]
  },
}

module.exports = nextConfig
