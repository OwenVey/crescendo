'use client';
import type { ButtonProps } from '@/components/ui';
import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';

export function SignInButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => signIn('spotify')}>
      Authorize Spotify
    </Button>
  );
}
