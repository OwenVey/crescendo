import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, icon, className, ...props }, ref) => {
  const id = React.useId();

  return (
    <div className={cn(className)}>
      {label && (
        <Label className="mb-2" htmlFor={id}>
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400 dark:hover:border-gray-700/75',
            'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800',
            // 'focus-visible:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:focus-visible:border-gray-700 dark:focus-visible:ring-gray-800',
            icon && 'pl-10',
          )}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
