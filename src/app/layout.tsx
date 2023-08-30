import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { inter } from './fonts/inter';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crescendo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.variable, 'h-full')}>
      <body className="h-full bg-gray-100 dark:bg-gray-900">
        <Providers>
          <Sidebar />
          <main className="pl-72 h-full">
            <div className="p-8 h-full">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
