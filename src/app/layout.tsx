import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ワンピカMETA | ワンピースカードゲーム メタ分析",
  description:
    "ワンピースカードゲームの店舗予選・フラッグシップバトルの優勝デッキデータを集計・分析。環境Tier表、メタ推移グラフ、デッキ相性マトリクスを毎日更新。",
  keywords: [
    "ワンピースカード",
    "ONE PIECE Card Game",
    "メタ",
    "Tier表",
    "環境",
    "デッキ",
    "優勝",
    "店舗予選",
    "フラッグシップ",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
