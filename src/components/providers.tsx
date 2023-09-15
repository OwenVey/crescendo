'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SpotifyPlayerProvider } from '@/lib/hooks/useSpotifyPlayer';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools as JotaiDevTools } from 'jotai-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import * as React from 'react';
import { SWRConfig } from 'swr';

async function fetcher<T>(...args: Parameters<typeof fetch>): Promise<T> {
  const response = await fetch(...args);
  return response.json();
}

export function Providers({ children }: { children: React.ReactNode }) {
  const areJotaiDevToolsEnabled = false;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <SWRConfig value={{ fetcher }}>
          <SessionProvider>
            <JotaiProvider>
              <SpotifyPlayerProvider>
                {areJotaiDevToolsEnabled && <JotaiDevTools />}
                {children}
              </SpotifyPlayerProvider>
            </JotaiProvider>
          </SessionProvider>
        </SWRConfig>
      </TooltipProvider>
    </ThemeProvider>
  );
}
