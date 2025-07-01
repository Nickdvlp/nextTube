import { db } from "@/app/db";
import { subscriptions, users, videos } from "@/app/db/schema";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, isNotNull } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { clerkId } = ctx;
      let userId: string | undefined;

      if (clerkId) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkId));
        userId = user?.id;
      }

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select()
          .from(subscriptions)
          .where(userId ? eq(subscriptions.viewerId, userId) : undefined)
      );

      const [existingUser] = await db
        .with(viewerSubscriptions)
        .select({
          ...getTableColumns(users),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).as(
            "viewerSubscribed"
          ),
          videoCount: db.$count(videos, eq(videos.userId, users.id)),
          subscriberCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, users.id)
          ),
        })
        .from(users)
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        )
        .where(eq(users.id, input.id));

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingUser;
    }),
});
