/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
