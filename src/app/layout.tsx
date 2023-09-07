import { MobileNav } from '@/components/mobile-nav';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import Script from 'next/script';
import { inter } from './fonts/inter';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crescendo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.variable, 'h-full antialiased')}>
      <body className="flex h-screen flex-col overflow-hidden bg-gray-100 dark:bg-gray-900 md:flex-row">
        <Providers>
          <MobileNav />
          <Sidebar className="hidden md:flex" />
          <main className="flex flex-1 overflow-y-auto">{children}</main>
          <Toaster />
        </Providers>
      </body>
      <Script
        id="spotify-player"
        dangerouslySetInnerHTML={{
          __html: `window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('Spotify Web Playback SDK Ready')
          }`,
        }}
      />
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </html>
  );
}
