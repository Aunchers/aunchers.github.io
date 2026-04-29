import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = await getCollection("posts");
  const published = posts.filter(p => p.data.status !== "draft");
  return rss({
    title: "CHAIRS Blog",
    description: "ramblings of a canadian guy who likes computers",
    site: new URL(context.request.url).origin,
    items: published.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
