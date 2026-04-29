// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://aunchers.github.io",
  base: "/",
  integrations: [mdx()],
  output: "static",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
