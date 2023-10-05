import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { users } from '@/server/db/schema'
import { NewUser } from '@/server/db/schema/users'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    return new Response(`Webhook Error: ${ err instanceof Error ? err.message : 'Unknown Error' }`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  
  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    await users.updateUserBySubscriptionId(subscription.id, {
      stripePriceId: subscription.items.data[0].price.id,
      stripeSubscriptionStatus: subscription.status as string, // TODO: Use session.status instead of subscription.status ??
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    } as NewUser)

  } else if (event.type === 'checkout.session.completed') {

    if (!session?.metadata?.userId) {
      return new Response('Error: Metadata UserId not set', { status: 404 })
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    await users.updateUser(session.metadata.userId, {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionStatus: subscription.status as string,

      /*
      stripeSubscriptionQuantity: subscription.items.data[0].quantity
      */
    } as NewUser)
  }

  return new Response(null, { status: 200 })
}