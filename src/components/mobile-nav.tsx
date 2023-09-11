'use client';

import logo from '@/app/icon.svg';

import { Sidebar } from '@/components/sidebar';
import { SignInButton } from '@/components/sign-in-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

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
              <Avatar>
                <AvatarImage src={session.user.image!} alt={`Profile picture for ${session.user.name}`} />
                <AvatarFallback className="uppercase">{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
