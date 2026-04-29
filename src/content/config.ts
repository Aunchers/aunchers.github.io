import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string(),
    layout: z.string().optional(),
    cover: z.string().optional(),
    categories: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    num: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
