'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SpotifyPlayerProvider } from '@/lib/hooks/useSpotifyPlayer';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import * as React from 'react';
import { SWRConfig } from 'swr';

async function fetcher<T>(...args: Parameters<typeof fetch>): Promise<T> {
  const response = await fetch(...args);
  return response.json();
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <SWRConfig value={{ fetcher }}>
          <SessionProvider>
            <SpotifyPlayerProvider>{children}</SpotifyPlayerProvider>
          </SessionProvider>
        </SWRConfig>
      </TooltipProvider>
    </ThemeProvider>
  );
}
