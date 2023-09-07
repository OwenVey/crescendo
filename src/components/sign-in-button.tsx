'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function SignInButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => signIn('spotify')}>
      Authorize Spotify
    </Button>
  );
}
