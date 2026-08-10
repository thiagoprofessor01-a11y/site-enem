/** @type {import('next').NextConfig} */

// Content-Security-Policy — permite o que o site realmente usa:
//  - scripts: o próprio site + Meta Pixel (connect.facebook.net) + inline (Next/pixel)
//  - frames: YouTube (vídeos) e about:srcdoc (questões em iframe isolado via 'self')
//  - connect/img: https/wss (Supabase, Facebook, thumbnails)
// Se algo parar de funcionar, é aqui que se ajusta a fonte permitida.
// Observação: questões e simulados são HTML colado que roda em iframe ISOLADO
// (sandbox sem allow-same-origin, sem acesso a cookies/sessão). Como o srcdoc
// herda o CSP da página, precisamos permitir scripts/estilos/fontes externos
// para esses conteúdos (gráficos, fontes, etc.) renderizarem como no original.
// As proteções de maior valor continuam: frame-ancestors (anti-clickjacking),
// object-src 'none', base-uri, HSTS, nosniff, etc.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' blob: https://*.supabase.co https://www.youtube-nocookie.com https://www.youtube.com",
  "media-src 'self' https: blob: data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // não revela "X-Powered-By: Next.js"
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
