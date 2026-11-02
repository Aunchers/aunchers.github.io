import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export interface SeriesTopic {
  slug: string;
  name: string | null;
  rows: { post: Post; num: number }[];
}

export interface SeriesChapter {
  slug: string;
  name: string | null;
  count: number;
  topics: SeriesTopic[];
  loose: { post: Post; num: number }[];
}

interface ChapterMeta {
  name: string;
  topics?: Record<string, { name: string }>;
}

interface SeriesMeta {
  name: string;
  description: string;
  chapters?: Record<string, ChapterMeta>;
}

export const seriesInfo: Record<string, SeriesMeta> = {
  "discrete-math": {
    name: "discrete math",
    description: "My CIS1910 notes",
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

export function topicName(
  seriesSlug: string,
  chapter: string,
  topic?: string | null,
) {
  if (!topic) return null;
  return (
    seriesInfo[seriesSlug]?.chapters?.[chapter]?.topics?.[topic]?.name ?? topic
  );
}

export function seriesPosts(posts: Post[], slug: string) {
  return posts
    .filter((p) => p.data.series === slug && p.data.status !== "draft")
    .sort((a, b) => (a.data.part ?? 99) - (b.data.part ?? 99));
}

function numbered(posts: Post[]) {
  return posts.map((post, i) => ({ post, num: post.data.part ?? i + 1 }));
}

/**
 * three levels: a series holds chapters, a chapter holds topics (an article
 * arc like "proofs"), and a topic holds the numbered parts. each level is
 * optional — a chapter can hold plain articles, and a series can hold
 * articles with no chapter at all.
 */
export function seriesChapters(posts: Post[], slug: string): SeriesChapter[] {
  const declared = Object.keys(seriesInfo[slug]?.chapters ?? {});
  const chapters = new Map<string, Post[]>();

  for (const post of seriesPosts(posts, slug)) {
    const key = post.data.chapter ?? "";
    const bucket = chapters.get(key);
    if (bucket) bucket.push(post);
    else chapters.set(key, [post]);
  }

  const rank = (key: string) => {
    if (!key) return Number.MAX_SAFE_INTEGER;
    const at = declared.indexOf(key);
    return at === -1 ? declared.length : at;
  };

  return [...chapters.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([key, group]) => {
      const declaredTopics = Object.keys(
        seriesInfo[slug]?.chapters?.[key]?.topics ?? {},
      );
      const rows = new Map<string, Post[]>();

      for (const post of group) {
        const topic = post.data.topic ?? "";
        const bucket = rows.get(topic);
        if (bucket) bucket.push(post);
        else rows.set(topic, [post]);
      }

      const topicRank = (topic: string) => {
        const at = declaredTopics.indexOf(topic);
        return at === -1 ? declaredTopics.length : at;
      };

      return {
        slug: key,
        name: chapterName(slug, key),
        count: group.length,
        topics: [...rows.entries()]
          .filter(([topic]) => topic)
          .sort(([a], [b]) => topicRank(a) - topicRank(b) || a.localeCompare(b))
          .map(([topic, list]) => ({
            slug: topic,
            name: topicName(slug, key, topic),
            rows: numbered(list),
          })),
        loose: numbered(rows.get("") ?? []),
      };
    });
}

export function placeInSeries(all: Post[], post: Post) {
  const slug = post.data.series;
  if (!slug) return null;

  const chapters = seriesChapters(all, slug);
  const total = chapters.reduce((n, c) => n + c.count, 0);
  if (total < 2) return null;

  for (const chapter of chapters) {
    for (const topic of chapter.topics) {
      const at = topic.rows.findIndex(
        (r) => r.post.data.slug === post.data.slug,
      );
      if (at === -1) continue;
      if (topic.rows.length < 2) return null;

      return {
        slug,
        name: seriesName(slug),
        chapter: chapter.name,
        chapterSlug: chapter.slug || null,
        topic: topic.name,
        topicSlug: topic.slug,
        part: post.data.part ?? topic.rows[at].num,
        total: topic.rows.length,
      };
    }

    const at = chapter.loose.findIndex(
      (r) => r.post.data.slug === post.data.slug,
    );
    if (at === -1) continue;
    if (chapter.loose.length < 2) return null;

    return {
      slug,
      name: seriesName(slug),
      chapter: chapter.name,
      chapterSlug: chapter.slug || null,
      topic: null,
      topicSlug: null,
      part: post.data.part ?? chapter.loose[at].num,
      total: chapter.loose.length,
    };
  }

  return null;
}
