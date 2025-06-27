import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pustaka Buana',
  description: 'Website informasi pertanian & kehutanan berkelanjutan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        {children}
        <footer className="text-center text-sm text-gray-500 py-6 px-4">
          © 2025 Pustaka Buana. All rights reserved.
        </footer>
      </body>
    </html>
  );
}