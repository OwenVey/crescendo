'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { MotionConfig, motion } from 'framer-motion';
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  size?: 'default' | 'sm';
  thumbVisibility?: 'always' | 'hover' | 'never';
  grow?: boolean;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, size = 'default', thumbVisibility = 'always', grow = false, ...props }, ref) => {
    const initialHeightSm = 5;
    const initialHeightDefault = 8;
    const height = 13;
    const buffer = 13;
    const [hovered, setHovered] = React.useState(false);
    const [panning, setPanning] = React.useState(false);
    const state = panning ? 'panning' : hovered ? 'hovered' : 'idle';

    return (
      <MotionConfig transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
        <SliderPrimitive.Root asChild ref={ref} {...props}>
          <motion.div
            className={cn(
              'group relative flex w-full touch-none select-none items-center justify-center overflow-hidden',
              className,
            )}
            style={{ height: height + buffer }}
            animate={state}
            onPanStart={() => grow && setPanning(true)}
            onPanEnd={() => setPanning(false)}
            onPointerEnter={() => grow && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <SliderPrimitive.Track asChild>
              <motion.div
                className="relative grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                initial={false}
                variants={{
                  idle: {
                    height: size === 'sm' ? initialHeightSm : initialHeightDefault,
                  },
                  hovered: { height },
                  panning: { height },
                }}
              >
                <SliderPrimitive.Range className="absolute h-full bg-gray-900 dark:bg-gray-50" />
              </motion.div>
            </SliderPrimitive.Track>

            {Array.from({ length: props.defaultValue?.length ?? 1 }, (_, i) => (
              <SliderPrimitive.Thumb
                key={i}
                className={cn(
                  'block rounded-full border-2 border-gray-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-50 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
                  size === 'sm' ? 'h-3 w-3' : 'h-5 w-5',
                  thumbVisibility === 'hover' && 'opacity-0 transition-opacity group-hover:opacity-100',
                  thumbVisibility === 'never' && 'hidden',
                )}
              />
            ))}
          </motion.div>
        </SliderPrimitive.Root>
      </MotionConfig>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
