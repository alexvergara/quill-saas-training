import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger  } from '@/components/ui/tooltip';
import { CheckIcon, HelpCircleIcon, MinusIcon } from 'lucide-react';
import { cn, dm } from '@/lib/utils';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UpgradeButton from '@/components/billing/UpgradeButton';
import { PLAN_DETAILS, PLAN_FEATURES } from '@/config';

const PricingPage = () => {
  const defaultPlan = PLAN_FEATURES.default;
  const parsedPlans = []

  for (let index in PLAN_FEATURES) {
    let plan = PLAN_FEATURES[index as keyof typeof PLAN_FEATURES] as any;

    if (index !== 'default') plan = dm(plan, defaultPlan);
    
    const details = PLAN_DETAILS[plan.name as keyof typeof PLAN_DETAILS];

    plan.quota = details.quota
    plan.price = details.price.amount
    plan.features.size.text = plan.features.size.text.replace('{size}', details.size ? `${details.size} MB`  : 'Unlimited')
    plan.features.pages.text = plan.features.pages.text.replace('{pages}', details.pages ? details.pages : 'Unlimited')
    // TODO: Fix size and pages for non-default plans

    parsedPlans.push(plan);
  }

  return (
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-2-5xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg dark:text-slate-400">Whether your&apos;re just trying out our service or need more, we&apos;ve got you covered.</p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 ">
          <TooltipProvider>
            {parsedPlans.map((plan: any) => (
              <div className={cn('relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg border', plan.popular ? 'border-2 border-blue-600 shadow-blue-200 dark:shadow-blue-900' : 'border-gray-200')} key={plan.name}>
                {plan.popular && <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                  Upgrade now
                </div>}

                <div className="p-5">
                  <h3 className="my-3 text-center font-display text-3xl font-bold">
                    {plan.name}
                  </h3>

                  <p className="text-gray-500 dark:text-slate-400">{plan.tagline}</p>
                  <p className="my-5 font-display text-6xl font-semibold">${plan.price}</p>
                  <p className="text-gray-500 dark:text-slate-400">per month</p>

                </div>

                <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center space-x-1">
                    <p>{plan.quota.toLocaleString()} PDFs/mo included</p>

                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <HelpCircleIcon className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      </TooltipTrigger>

                      <TooltipContent className="w-80 p-2">
                        The number of PDFs you can upload per month.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {Object.values(plan.features).map((features: any, index: number) => (
                    <li className="flex space-x-5" key={index}>
                      <div className="flex-shrink-0">
                        {features.missing ? (
                          <MinusIcon className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                        ) : (
                          <CheckIcon className="w-6 h-6 text-blue-500" />
                        )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <p className={cn(features.missing ? 'text-gray-600 dark:text-slate-500' : 'text-gray-400')}>
                            {features.text}
                          </p>
                          {features.footnote && (
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger>
                                <HelpCircleIcon className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                              </TooltipTrigger>

                              <TooltipContent className="w-80 p-2">
                                {features.footnote}
                              </TooltipContent>
                            </Tooltip>
                          )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray200">
                  <div className="p-5">
                    <UpgradeButton plan={plan} />
                  </div>
                </div>
              </div>
            ))}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
  );
};

export default PricingPage;
