import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { projectStatuses } from "./project-status";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    slug: z.string(),
    externalUrl: z.string().optional(),
    status: z.string().optional().default("published"),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(projectStatuses).optional().default("active"),
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
