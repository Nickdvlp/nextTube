import { db } from "@/app/db";
import { categories } from "@/app/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(categories);
    return data;
  }),
});
