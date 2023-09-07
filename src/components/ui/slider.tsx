'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  size?: 'default' | 'sm';
  showThumbOnHover?: boolean;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, size = 'default', showThumbOnHover = false, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'group relative flex w-full touch-none select-none items-center data-[orientation=horizontal]:py-2 data-[orientation=vertical]:px-2',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          size === 'sm' ? 'h-1' : 'h-2',
        )}
      >
        <SliderPrimitive.Range className="absolute h-full bg-gray-900 dark:bg-gray-50" />
      </SliderPrimitive.Track>
      {Array.from({ length: props.defaultValue?.length ?? 1 }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            'block rounded-full border-2 border-gray-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-50 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
            size === 'sm' ? 'h-3 w-3' : 'h-5 w-5',
            showThumbOnHover ? 'opacity-0 transition-opacity group-hover:opacity-100' : '',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  ),
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
