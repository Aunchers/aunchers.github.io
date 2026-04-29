import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string(),
    layout: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    categories: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    num: z.string().optional(),
    status: z.enum(["published", "draft", "wip", "archived"]).optional().default("published"),
    featured: z.boolean().optional().default(false),
    articleType: z.enum(["essay", "tutorial", "log", "review", "deep-dive", "link-post", "photo-essay"]).optional().default("essay"),
    series: z.string().optional(),
    seriesPosition: z.object({ current: z.number(), total: z.number() }).optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
    tools: z.array(z.string()).optional(),
    externalUrl: z.string().optional(),
    updatedDate: z.date().optional(),
    author: z.string().optional(),
    authorUrl: z.string().optional(),
    noTOC: z.boolean().optional().default(false),
    noDropCap: z.boolean().optional().default(false),
    relatedProject: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(["active", "archived", "hiatus", "wip"]).optional().default("active"),
    dateRange: z.string().optional(),
    url: z.string().optional(),
    repo: z.string().optional(),
    tech: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
    featured: z.boolean().optional().default(false),
    blogPost: z.string().optional(),
  }),
});

export const collections = {
  posts,
  projects,
};
