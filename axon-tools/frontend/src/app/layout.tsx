import type { Metadata } from "next";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Axon Tools",
  description: "Lokalne środowisko deweloperskie dla narzędzi Axon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={`${jetbrainsMono.className} antialiased bg-neutral-950 text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
