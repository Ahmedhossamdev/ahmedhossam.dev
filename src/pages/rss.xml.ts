import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedWriting } from "@/utils/content";

export async function GET(context: APIContext) {
  const posts = await getPublishedWriting();

  return rss({
    title: "Ahmed Hossam",
    description:
      "Software, things I'm learning, things I'm curious about, and occasional thoughts about life.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
