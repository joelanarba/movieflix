"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { AuthProvider } from "../contexts/AuthContext";
import Layout from "../components/Layout/Layout";
import StyledComponentsRegistry from "../lib/styled-components-registry";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MovieFlix - Discover Amazing Movies</title>
        <meta
          name="description"
          content="Discover trending movies, save favorites, and explore detailed movie information with MovieFlix."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="MovieFlix" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <FavoritesProvider>
              <Layout>{children}</Layout>
            </FavoritesProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
