"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { initMatomo } from "@/lib/matomo";
import { loadAdSterraScript } from "@/services/ads/adService";

const inter = Inter({ subsets: ["latin"] });

// メタデータはサーバーコンポーネントでのみ動作するため別のファイルに移動
// またはクライアントコンポーネントとして動作させるため静的に定義
const siteTitle = "広告イレイザー | 広告を消して点数を稼ごう！";
const siteDescription = "広告の×ボタンを素早く正確にタップして、高スコアを目指すゲーム";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Matomoとアドネットワークの初期化
  useEffect(() => {
    // Matomo分析の初期化
    initMatomo();
    
    // AdSterraスクリプトの読み込み
    loadAdSterraScript();
  }, []);

  return (
    <html lang="ja">
      <head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center justify-center bg-light">
          {children}
        </main>
      </body>
    </html>
  );
} 