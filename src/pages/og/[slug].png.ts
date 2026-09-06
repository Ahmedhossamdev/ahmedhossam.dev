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

  let backgroundImage: string | undefined;

  if (heroImage) {
    const imagePath = resolve(`public${heroImage}`);
    if (existsSync(imagePath)) {
      const imageBuffer = readFileSync(imagePath);
      const ext = imagePath.split(".").pop()?.toLowerCase();
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      backgroundImage = `data:${mime};base64,${imageBuffer.toString("base64")}`;
    }
  }

  const fontSize = title.length > 50 ? "44px" : "56px";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Inter",
          position: "relative",
          ...(backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundColor: "#1C1B1A" }),
        },
        children: [
          // Top label
          {
            type: "div",
            props: {
              style: {
                padding: "40px 56px 0",
                color: "#3AA99F",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                ...(backgroundImage && {
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }),
              },
              children: "ahmedhossamdev.com",
            },
          },
          // Bottom text area
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "0 56px 48px",
                ...(backgroundImage && {
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
                  paddingTop: "80px",
                }),
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      color: backgroundImage ? "#ffffff" : "#F2F0E5",
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
                      color: backgroundImage ? "rgba(255,255,255,0.7)" : "#878580",
                      fontSize: "20px",
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

  const png = await sharp(Buffer.from(svg)).png({ quality: 85 }).toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
