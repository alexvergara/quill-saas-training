import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  // test: publicProcedure.query(() => {
  //   //return new Response();
  //   return { message: "Hello World" };
  // }),

  authCallback: publicProcedure.query(() => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }),
});

export type AppRouter = typeof appRouter;
