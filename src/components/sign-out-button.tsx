'use client';
import type { ButtonProps } from '@/components/ui';
import { Button } from '@/components/ui';
import { signOut } from 'next-auth/react';

export function SignOutButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}
