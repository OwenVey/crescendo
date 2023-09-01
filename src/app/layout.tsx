import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { inter } from './fonts/inter';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crescendo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.variable, 'h-full antialiased')}>
      <body className="h-full bg-gray-100 dark:bg-gray-900">
        <Providers>
          <Sidebar />
          <main className="h-full pl-80">
            <div className="h-full overflow-auto p-8">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
