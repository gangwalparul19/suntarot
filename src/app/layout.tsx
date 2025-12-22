import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { StarryBackground } from '@/components/layout/starry-background';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Mystic Insights',
  description: 'A mystical journey of self-discovery through tarot card readings.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#D4A95D',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
        )}
      >
        <FirebaseClientProvider>
          <StarryBackground />
          <div className="relative flex min-h-dvh flex-col bg-background/60 backdrop-blur-sm">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
