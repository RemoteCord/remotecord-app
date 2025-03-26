/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com", "cdn.discordapp.com"],
  },
};

export default nextConfig;
