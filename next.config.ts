import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tillad preview-domæner (E2B-sandboxens live preview: *.e2b.app) i
  // dev-serveren, så hot-reload og JS-bundles kan loades derinde. Uden
  // denne blokeres cross-origin-forespørgsler, og appen virker ikke i
  // preview-iframe'en.
  allowedDevOrigins: [
    "*.e2b.app",
    "3000-imvwfl95tku57ra20ooza.e2b.app",
  ],
};

export default nextConfig;
