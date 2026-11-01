import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export const seriesInfo: Record<string, { name: string; description: string }> = {
  "discrete-math": {
    name: "discrete math",
    description:
      "my CIS1910 notes, rewritten so they're actually readable instead of six pages of handwriting.",
  },
};

export const seriesSlugs = Object.keys(seriesInfo);

export function seriesName(slug: string) {
  return seriesInfo[slug]?.name ?? slug;
}

export function seriesPosts(posts: Post[], slug: string) {
  return posts
    .filter((p) => p.data.series === slug && p.data.status !== "draft")
    .sort((a, b) => (a.data.part ?? 99) - (b.data.part ?? 99));
}

export function placeInSeries(all: Post[], post: Post) {
  const slug = post.data.series;
  if (!slug) return null;

  const parts = seriesPosts(all, slug);
  const at = parts.findIndex((p) => p.data.slug === post.data.slug);
  if (at === -1 || parts.length < 2) return null;

  return {
    slug,
    name: seriesName(slug),
    part: post.data.part ?? at + 1,
    total: parts.length,
  };
}
