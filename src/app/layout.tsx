import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { inter } from './fonts/inter';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Spotify App',
  icons: {
    icon: {
      url: '/favicon.svg',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.variable, 'h-full')}>
      <body className="h-full bg-gray-100 dark:bg-gray-900">
        <Providers>
          <Sidebar />

          <main className="pl-72">
            <div className="p-8">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
