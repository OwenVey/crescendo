import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui';
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
      <body className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Providers>
          <Sidebar />
          <main className="flex flex-1">{children}</main>
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
