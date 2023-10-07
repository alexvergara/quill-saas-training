'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

type ProgressWithColorProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
};

const ProgressWithColor = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressWithColorProps>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)} {...props}>
    <ProgressPrimitive.Indicator className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorClassName)} style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
));
ProgressWithColor.displayName = 'ProgressWithColor'; // ProgressPrimitive.Root.displayName

export { ProgressWithColor };