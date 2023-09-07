'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export function SignOutButton(props: ButtonProps) {
  return (
    <Button {...props} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}
