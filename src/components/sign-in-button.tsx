'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { LogInIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function SignInButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => signIn('spotify')} className="h-10 w-10 p-0 md:w-auto md:px-4 md:py-2">
      <LogInIcon className="h-4 w-4" />
      <span className="ml-2 hidden md:block">Authorize Spotify</span>
    </Button>
  );
}
