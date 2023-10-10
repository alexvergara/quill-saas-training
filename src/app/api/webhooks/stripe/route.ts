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

  if (event.type === 'invoice.payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await updateSubscriptionBySubscriptionId(subscription.id, {
      subscriptionStatus: subscription.status as string, // TODO: Use session.status instead of subscription.status ??
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    } as NewSubscription);
  } else if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.publicId) return new Response('Error: Metadata publicId not set', { status: 404 });

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // We could use session.metadata.publicId as well
    await upsertUserSubscription(session.client_reference_id!, {
      planId: session.metadata.planId as string,
      priceId: subscription.items.data[0].price.id,
      customerId: subscription.customer as string,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      subscriptionStatus: subscription.status as string
      // Quantity ?
    } as NewSubscription);
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;

    await updateSubscriptionBySubscriptionId(subscription.id, {
      subscriptionStatus: subscription.status as string, // TODO: Use session.status instead of subscription.status ??
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    } as NewSubscription);
  }

  // TODO: Customer deleted

  return new Response(null, { status: 200 });
}
