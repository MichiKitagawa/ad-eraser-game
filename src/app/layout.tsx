import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "広告イレイザー | 広告を消して点数を稼ごう！",
  description: "広告の×ボタンを素早く正確にタップして、高スコアを目指すゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center justify-center bg-light">
          {children}
        </main>
      </body>
    </html>
  );
} 