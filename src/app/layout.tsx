
'use client';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { RoleProvider } from '@/hooks/use-role';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
        <title>CampusSync</title>
        <meta name="description" content="Streamlining School Management" />
      </head>
      <body className={cn('font-body antialiased')}>
        <RoleProvider>
          {children}
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  );
}
