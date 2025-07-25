import { db } from "@/app/db";
import { videos } from "@/app/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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

  const { body } = await context.api.openai.call("generate-description", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: DESCRIPTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  const description = body.choices[0]?.message.content;
  if (!description) {
    throw new Error("Bad Request");
  }
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        description: description || video[0].description,
      })
      .where(
        and(eq(videos.id, video[0].id), eq(videos.userId, video[0].userId))
      );
  });

  await context.run("second-step", () => {
    console.log("second step ran");
  });
});
