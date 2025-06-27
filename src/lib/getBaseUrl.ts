// lib/getBaseUrl.ts

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Saat di client (browser), ambil dari window
    return window.location.origin;
  }

  // Saat di server:
  // Gunakan domain Vercel jika tersedia, atau fallback ke localhost
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}
