import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export interface SeriesChapter {
  slug: string;
  name: string | null;
  rows: { post: Post; num: number }[];
}

interface SeriesMeta {
  name: string;
  description: string;
  chapters?: Record<string, { name: string }>;
}

export const seriesInfo: Record<string, SeriesMeta> = {
  "discrete-math": {
    name: "discrete math",
    description: "my CIS1910 notes",
    chapters: {
      logic: { name: "logic" },
    },
  },
};

export const seriesSlugs = Object.keys(seriesInfo);

export function seriesName(slug: string) {
  return seriesInfo[slug]?.name ?? slug;
}

export function chapterName(seriesSlug: string, chapter?: string | null) {
  if (!chapter) return null;
  return seriesInfo[seriesSlug]?.chapters?.[chapter]?.name ?? chapter;
}

export function seriesPosts(posts: Post[], slug: string) {
  return posts
    .filter((p) => p.data.series === slug && p.data.status !== "draft")
    .sort((a, b) => (a.data.part ?? 99) - (b.data.part ?? 99));
}

/**
 * parts grouped into chapters. declared chapters keep the order they have in
 * seriesInfo, undeclared ones follow alphabetically and chapter-less posts
 * come last, so a series can grow chapters without touching every post.
 */
export function seriesChapters(posts: Post[], slug: string): SeriesChapter[] {
  const declared = Object.keys(seriesInfo[slug]?.chapters ?? {});
  const buckets = new Map<string, Post[]>();

  for (const post of seriesPosts(posts, slug)) {
    const key = post.data.chapter ?? "";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(post);
    else buckets.set(key, [post]);
  }

  const rank = (key: string) => {
    if (!key) return Number.MAX_SAFE_INTEGER;
    const at = declared.indexOf(key);
    return at === -1 ? declared.length : at;
  };

  return [...buckets.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([key, group]) => ({
      slug: key,
      name: chapterName(slug, key),
      rows: group.map((post, i) => ({ post, num: post.data.part ?? i + 1 })),
    }));
}

export function placeInSeries(all: Post[], post: Post) {
  const slug = post.data.series;
  if (!slug) return null;

  const chapters = seriesChapters(all, slug);
  const total = chapters.reduce((n, c) => n + c.rows.length, 0);
  if (total < 2) return null;

  for (const chapter of chapters) {
    const at = chapter.rows.findIndex((r) => r.post.data.slug === post.data.slug);
    if (at === -1) continue;

    return {
      slug,
      name: seriesName(slug),
      chapter: chapter.name,
      chapterSlug: chapter.slug || null,
      part: post.data.part ?? chapter.rows[at].num,
      total: chapter.rows.length,
    };
  }

  return null;
}
