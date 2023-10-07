//import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserByPublicId } from '@/server/db/utils';

import Dashboard from '@/components/Dashboard';

const DashboardPage = async () => {
  const authCallback = '/auth/callback?origin=dashboard';
  /*const { getUser } = getKindeServerSession();
  const user = getUser();*/
  const clerkUser = await currentUser();
  const user = await getUserByPublicId(clerkUser?.id || '');

  console.log('DashboardPage User', user, clerkUser);

  if (!clerkUser || !user) redirect(authCallback);

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
