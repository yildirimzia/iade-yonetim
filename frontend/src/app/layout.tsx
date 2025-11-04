import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'İade Yönetim Sistemi',
  description: 'Bulgaristan merkezli iade ve kargo yönetim platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
