import { cn } from '@/lib/utils';

export function AudioWave({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="wave"
      className={cn('', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 38.05"
      fill="currentColor"
      {...props}
    >
      <title>Audio Wave</title>
      <path
        className="animate-wave [animation-delay:-150ms]"
        d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"
      />
      <path
        className="animate-wave [animation-delay:-300ms]"
        d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"
      />
      <path
        className="animate-wave [animation-delay:-450ms]"
        d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"
      />
      <path
        className="animate-wave [animation-delay:-600ms]"
        d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"
      />
      <path
        className="animate-wave [animation-delay:-750ms]"
        d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"
      />
      <path
        className="animate-wave [animation-delay:-900ms]"
        d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"
      />
      <path
        className="animate-wave [animation-delay:-1050ms]"
        d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z"
      />
      <path
        className="animate-wave [animation-delay:-1200ms]"
        d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z"
      />
      <path
        className="animate-wave [animation-delay:-1350ms]"
        d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z"
      />
    </svg>
  );
}
