const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Abaikan error ESLint saat build di Vercel
  },
};

export default nextConfig;
