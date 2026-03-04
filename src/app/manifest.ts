import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "무용한 기쁨 — Pointless Joy",
    short_name: "무용한 기쁨",
    description: "나를 기쁘게 하는 아름답지만 무용한 것은?",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0F23",
    theme_color: "#0F0F23",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/api/app-icon?size=192", sizes: "192x192", type: "image/png" },
      { src: "/api/app-icon?size=512", sizes: "512x512", type: "image/png" },
    ],
  };
}
