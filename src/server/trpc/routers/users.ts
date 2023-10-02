import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { User } from "@/server/db/schema";

export const usersRouter = {
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const dbUser = await User.getUserByExternalId(user.id);

    if (!dbUser) {
      await User.insertUser({
        externalId: user.id,
        email: user.email,
      });
    }

    return { success: true };
  }),
};
