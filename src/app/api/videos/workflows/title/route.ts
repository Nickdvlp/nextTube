import { db } from "@/app/db";
import { videos } from "@/app/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const existingVideo = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }
    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video[0].muxPlaybackId}/text/${video[0].muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();
    return text;
  });

  const { body } = await context.api.openai.call("Call OpenAI", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  const title = body.choices[0]?.message.content;
  if (!title) {
    throw new Error("Bad Request");
  }
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        title: title || video[0].title,
      })
      .where(
        and(eq(videos.id, video[0].id), eq(videos.userId, video[0].userId))
      );
  });

  await context.run("second-step", () => {
    console.log("second step ran");
  });
});
