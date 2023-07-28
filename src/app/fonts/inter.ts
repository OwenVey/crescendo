import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    { path: './Inter.var.woff2', style: 'normal' },
    { path: './Inter-italic.var.woff2', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-inter',
});
