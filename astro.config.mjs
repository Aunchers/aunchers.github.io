// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { bracketColorizer } from "./src/lib/bracket-colorizer.mjs";

export default defineConfig({
  site: "https://aunchers.github.io",
  base: "/",
  integrations: [
    mdx({
      processor: unified({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    }),
  ],
  output: "static",
  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: "dracula",
      transformers: [bracketColorizer()],
    },
  },
});
