import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './context/AuthProvider';
import { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT TOASTER

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoFinds',
  description: 'Sustainable Second-Hand Marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Toaster position="top-center" /> {/* <-- 2. ADD TOASTER COMPONENT */}
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}