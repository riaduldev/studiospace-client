import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co", // ImgBB ডোমেইন অনুমতি দেওয়া হলো
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // যদি কখনো Unsplash-এর ছবি ব্যবহার করেন
      },
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;