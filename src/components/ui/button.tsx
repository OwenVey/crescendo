import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-t from-blue-500 to-cyan-400 hover:to-blue-500 active:from-blue-600 active:to-blue-600 shadow-sm text-white',
        default:
          'bg-gray-900 text-gray-50 hover:bg-gray-700 active:bg-gray-600 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-400',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:active:bg-gray-600',
        destructive:
          'bg-red-600 text-gray-50 hover:bg-red-500 active:bg-red-400 dark:bg-red-500 dark:text-red-50 dark:hover:bg-red-400 dark:active:bg-red-300',
        outline:
          'border border-gray-200  bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:hover:text-white',
        ghost:
          'text-gray-900 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:hover:text-white',
        link: 'text-gray-900 underline-offset-4 hover:underline dark:text-gray-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
  tooltip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, asChild = false, children, tooltip, ...props }, ref) => {
    const Tag = asChild ? Slot : 'button';
    const Comp = (
      <Tag className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={loading} {...props}>
        {loading ? (
          <>
            <LoaderIcon className="absolute h-4 w-4 animate-spin" />
            <span className="opacity-0">{children}</span>
          </>
        ) : (
          children
        )}
      </Tag>
    );

    return tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>
          {props.disabled ? <span tabIndex={0}>{Comp}</span> : <span>{Comp}</span>}
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    ) : (
      Comp
    );
  },
);
Button.displayName = 'Button';

export { Button };
