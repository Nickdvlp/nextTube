import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET!;
  console.log(SIGNING_SECRET);

  // if (!SIGNING_SECRET) {
  //   throw new Error(
  //     "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
  //   );
  // }
  // create new svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);
  console.log(wh);

  //   get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  //   get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  //   verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error: Could not verify webhook:", error);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  //   Do something with payload
  // For this guide, log payload to console

  const eventType = evt.type;
  if (eventType === "user.created") {
    const { data } = evt;
    console.log(data);
    await db.insert(users).values({
      clerkId: data.id,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
    });
  }

  if (eventType === "user.deleted") {
    const { data } = evt;
    console.log(data);
    if (!data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    await db.delete(users).where(eq(users.clerkId, data.id));
  }

  if (eventType === "user.updated") {
    const { data } = evt;
    console.log(data);
    if (!data.id) {
      return new Response("Missing user id", { status: 400 });
    }

    await db
      .update(users)
      .set({
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, data.id));
  }

  return new Response("Webhook recieved", { status: 200 });
}
