import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from './providers';
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerichi - Tìm kiếm và chia sẻ lời bài hát",
  description: "Trang web tìm kiếm, lưu trữ và chia sẻ lời bài hát tiếng Việt và quốc tế.",
  keywords: "lời bài hát, lyrics, nhạc việt, bài hát, tìm kiếm lời bài hát",
  authors: [{ name: "Nerichi Team" }],
  creator: "Yukiookii",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
