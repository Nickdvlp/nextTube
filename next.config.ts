// module.exports = {
//   allowedDevOrigins: ["https://man-adapting-gelding.ngrok-free.app/"],
// };

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};
export default nextConfig;
