// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.googleusercontent.com" },
      { protocol: "https", hostname: "books.google.com" },
      // algunos resultados vienen en http, permitimos por las dudas:
      { protocol: "http", hostname: "books.google.com" },
    ],
  },
};
export default nextConfig;
