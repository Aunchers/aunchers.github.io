// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://aunchers.github.io", // Replace with your actual site URL
  base: "/site",
  integrations: [react(), icon(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },
});
