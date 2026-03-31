import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AI } from "@/modules/agents/infrastructure/AiProvider";
import Providers  from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Axon",
  description: "AI Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            async
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-sans antialiased h-screen overflow-hidden bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AI>
          <Providers>
            {children}
            <Toaster position="bottom-center" />
          </Providers>
        </AI>
      </body>
    </html>
  );
}
