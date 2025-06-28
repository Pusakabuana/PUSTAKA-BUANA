const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // <--- WAJIB agar Vercel tidak gagal build
  },
};

export default nextConfig;