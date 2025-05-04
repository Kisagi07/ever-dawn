import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ever Dawn : Star Journey",
    short_name: "Ever Dawn",
    description: "Keep Track of Your Journey of Skills Learning",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#067bc2",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
