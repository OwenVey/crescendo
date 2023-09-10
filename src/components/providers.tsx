'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SpotifyPlayerProvider } from '@/lib/hooks/useSpotifyPlayer';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import * as React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <SessionProvider>
          <JotaiProvider>
            <SpotifyPlayerProvider>
              <DevTools />
              {children}
            </SpotifyPlayerProvider>
          </JotaiProvider>
        </SessionProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
