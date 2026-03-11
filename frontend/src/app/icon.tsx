// Using a plain SVG Response instead of ImageResponse to avoid the
// Windows-specific @vercel/og font URL resolution bug (ERR_INVALID_URL).
export const contentType = "image/svg+xml"

export default function Icon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#g)"/>
  <text x="16" y="22" font-family="system-ui,Arial,sans-serif" font-size="13" font-weight="800" fill="white" text-anchor="middle" letter-spacing="-0.5">FT</text>
</svg>`

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  })
}
