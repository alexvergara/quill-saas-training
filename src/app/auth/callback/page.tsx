"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Loader2Icon } from "lucide-react";

function AuthCallbackPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess({ success }) {
      if (success) {
        console.log("User is sync to database");
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError(error) {
      console.error(error);

      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/auth/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2Icon className="w-8 h-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirect automatically.</p>
      </div>
    </div>
  );
}

AuthCallbackPage.propTypes = {};

export default AuthCallbackPage;
