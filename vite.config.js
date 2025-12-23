import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "GuntiUniverse",
        short_name: "Gunti",
        description: "GuntiUniverse",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "logo/GU_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo/GU_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
});
