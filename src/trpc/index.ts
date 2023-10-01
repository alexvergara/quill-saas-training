import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db/client";

import { usersTable, type User } from "@/server/db/schema";

export const appRouter = router({
  // test: publicProcedure.query(() => {
  //   //return new Response();
  //   return { message: "Hello World" };
  // }),

  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const dbUser = await db
      .select()
      .from(usersTable)
      .where({ externalId: user.id })
      .first();
  }),
});

export type AppRouter = typeof appRouter;
