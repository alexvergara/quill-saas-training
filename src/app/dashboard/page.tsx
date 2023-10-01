import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/auth/callback?origin=dashboard");

  return <div>DashboardPage {user.email}</div>;
}

export default DashboardPage;
