'use client';

import logo from '@/app/images/logo.png';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { SignInButton } from './sign-in-button';
import { ThemeToggle } from './theme-toggle';

export function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  console.log({ pathname });

  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-2 bg-white px-6 py-4 shadow-sm dark:bg-gray-950 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className={cn(pathname === '/' && 'hidden')}>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="border-gray-200 p-0 dark:border-gray-800">
          <Sidebar className="h-full w-full border-none" />
        </SheetContent>
      </Sheet>

      <Link href="/" className="flex flex-1 items-center">
        <Image src={logo} alt="Logo" className="h-8 w-8" />
        <h1 className="ml-2 text-lg font-bold">Crescendo</h1>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-left">
              <Image
                className="h-10 w-10 rounded-full bg-gray-50"
                height={40}
                width={40}
                src={session.user.image!}
                alt="User's profile picture on Spotify"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignInButton variant="secondary" />
        )}
      </div>
    </div>
  );
}
