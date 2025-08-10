'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import Layout from '../components/Layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MovieFlix - Discover Amazing Movies</title>
        <meta name="description" content="Discover trending movies, save favorites, and explore detailed movie information with MovieFlix." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <FavoritesProvider>
          <Layout>{children}</Layout>
        </FavoritesProvider>
      </body>
    </html>
  );
}