import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "books.google.com", pathname: "/**" },
    ],
  },
  output: "standalone", // <- para Docker
  async redirects() {
    return [{ source: "/", destination: "/search", permanent: false }]; // opcional
  },
};

export default nextConfig;
