//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { User } from '@clerk/nextjs/api';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { users } from '@/server/db/schema';
import Dashboard from '@/components/Dashboard';

const DashboardPage = async () => {
  const authCallback = '/auth/callback?origin=dashboard';
  /*const { getUser } = getKindeServerSession();
  const user = getUser();*/
  const user: User | null = await currentUser();

  if (!user || !user.id) redirect(authCallback);

  const dbUser = await users.getUserById(user.id);

  if (!dbUser.length) redirect(authCallback);

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
