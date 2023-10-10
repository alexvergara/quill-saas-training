import type Stripe from 'stripe';
import type { NewSubscription } from '@/server/db/schema';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { upsertUserSubscription, updateSubscriptionBySubscriptionId } from '@/server/db/utils';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('Stripe-Signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await updateSubscriptionBySubscriptionId(subscription.id, {
      subscriptionStatus: subscription.status as string, // TODO: Use session.status instead of subscription.status ??
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    } as NewSubscription);
  } else if (event.type === 'checkout.session.completed') {
    if (!session?.metadata?.userId) {
      return new Response('Error: Metadata UserId not set', { status: 404 });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await upsertUserSubscription(session.metadata.userId, {
      plan: session.metadata.plan as string,
      priceId: subscription.items.data[0].price.id,
      customerId: subscription.customer as string,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      subscriptionStatus: subscription.status as string

      /*
      subscriptionQuantity: subscription.items.data[0].quantity
      */
    } as NewSubscription);
  }

  return new Response(null, { status: 200 });
}
