import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

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
  });

  return <div>AuthCallbackPage, {data?.message}</div>;
}

AuthCallbackPage.propTypes = {};

export default AuthCallbackPage;
