const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Abaikan semua error eslint saat build di Vercel
  },
};

export default nextConfig;
