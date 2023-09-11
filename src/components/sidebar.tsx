'use client';
import logo from '@/app/icon.svg';
import { SearchFilters } from '@/components/search-filters';
import { SignInButton } from '@/components/sign-in-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export function Sidebar({ className }: { className?: string }) {
  const { data: session } = useSession();
  return (
    <aside
      className={cn(
        'flex w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-center px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="ml-2 text-xl font-bold">Crescendo</h1>
        </Link>
      </header>

      <SearchFilters />

      {/* Footer */}
      <div className="flex h-16 shrink-0 items-center justify-between border-t border-gray-200 px-6 dark:border-gray-800">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-left">
              <div className="flex items-center gap-x-2">
                <Avatar>
                  <AvatarImage src={session.user.image!} alt={`Profile picture for ${session.user.name}`} />
                  <AvatarFallback className="uppercase">{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{session.user.name}</div>
                  <div className="text-xs text-gray-500">{session.user.email}</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignInButton size="sm" variant="secondary" />
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
}
