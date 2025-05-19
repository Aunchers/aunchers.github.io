import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const posts = await getCollection("posts");
  return rss({
    // `<title>` field in output xml
    title: "CHAIRS Blog",
    // `<description>` field in output xml
    description: "the incomprehensible ramblings of a canadian guy",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: new URL(context.request.url).origin,
    // Array of `<item>`s in output xml
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
