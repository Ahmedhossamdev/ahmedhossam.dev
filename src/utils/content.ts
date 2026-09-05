import { getCollection } from "astro:content";
import readingTime from "reading-time";

export async function getPublishedWriting() {
  const posts = await getCollection("writing", ({ data }) => {
    return import.meta.env.DEV ? true : !data.draft;
  });
  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

export async function getFeaturedProjects() {
  const projects = await getCollection("projects");
  return projects
    .filter((p) => p.data.featured)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getAllProjects() {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export function getReadingTime(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const { text } = readingTime(body);
  return text;
}

export function extractLinks(body: string | undefined): Array<{ text: string; url: string; hostname: string }> {
  if (!body) return [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const seen = new Set<string>();
  const links: Array<{ text: string; url: string; hostname: string }> = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    const [, text, url] = match;
    if (!seen.has(url)) {
      seen.add(url);
      links.push({ text, url, hostname: new URL(url).hostname });
    }
  }
  return links;
}
