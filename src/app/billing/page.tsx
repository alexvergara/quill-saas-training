import { getUserSubscriptionPlan } from '@/lib/stripe'
import { currentUser, User } from '@clerk/nextjs/server';

import BillingForm from '@/components/billing/BillingForm';

const BillingPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan}></BillingForm>


}

export default BillingPage