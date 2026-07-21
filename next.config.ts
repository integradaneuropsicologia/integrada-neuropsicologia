import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brand photography is already optimized AVIF. Serving it directly keeps
  // local previews and the Sites worker independent from an image binding.
  images: { unoptimized: true },
};

export default nextConfig;
