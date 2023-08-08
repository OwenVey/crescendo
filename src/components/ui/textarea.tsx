import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className={cn('grid w-full gap-1.5', className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <textarea
          id={id}
          className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-50 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800"
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
TextArea.displayName = 'TextArea';

export { TextArea };
