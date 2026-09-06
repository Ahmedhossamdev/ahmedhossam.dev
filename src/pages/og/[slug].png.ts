import type { APIRoute } from "astro";
import { getPublishedWriting, extractFirstImage } from "@/utils/content";
import satori from "satori";
import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export async function getStaticPaths() {
  const posts = await getPublishedWriting();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: {
      title: post.data.title,
      heroImage: extractFirstImage(post.body),
    },
  }));
}

const fontRegular = readFileSync(resolve("src/assets/inter-regular.ttf"));
const fontBold = readFileSync(resolve("src/assets/inter-bold.ttf"));

export const GET: APIRoute = async ({ props }) => {
  const { title, heroImage } = props as { title: string; heroImage?: string };

  // If article has a hero image, crop and resize it to 1200x630
  if (heroImage) {
    const imagePath = resolve(`public${heroImage}`);
    if (existsSync(imagePath)) {
      const png = await sharp(imagePath)
        .resize(1200, 630, { fit: "cover", position: "center" })
        .png({ quality: 85 })
        .toBuffer();
      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  // Fall back to generated title card
  const fontSize = title.length > 50 ? "48px" : "60px";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          backgroundColor: "#1C1B1A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                color: "#3AA99F",
                fontSize: "16px",
                fontWeight: "500",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              },
              children: "ahmedhossamdev.com",
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      color: "#F2F0E5",
                      fontSize,
                      fontWeight: "700",
                      lineHeight: "1.15",
                      letterSpacing: "-0.02em",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      color: "#878580",
                      fontSize: "22px",
                      fontWeight: "400",
                    },
                    children: "Ahmed Hossam",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
