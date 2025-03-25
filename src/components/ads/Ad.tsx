"use client";

import React, { useState, useEffect } from 'react';
import { isMobile } from '@/services/ads/adService';
import { trackAdClick, trackMissClick } from '@/lib/matomo';

// イベントバス用の型定義
interface AdRefreshEvent extends Event {
  detail?: any;
}

// カスタムイベント名
const REFRESH_BANNER_EVENT = 'refreshBannerAds';

interface AdProps {
  onClose: () => void;
  onMiss: () => void;
}

// 広告のサイズと×ボタンの位置のランダム設定のための定数
// モバイル用とデスクトップ用でサイズを分ける
const SIZE_CONFIG = {
  desktop: {
    minWidth: 280,
    maxWidth: 320,
    minHeight: 180,
    maxHeight: 250,
  },
  mobile: {
    minWidth: 260,
    maxWidth: 300,
    minHeight: 160,
    maxHeight: 200,
  }
};

// 広告コンテンツのダミーデータ
const AD_CONTENTS = [
  { title: 'お得なキャンペーン実施中！', content: '期間限定50%OFF' },
  { title: '新商品が登場！', content: '今なら送料無料' },
  { title: 'アプリダウンロード', content: '今すぐインストール' },
  { title: '限定オファー', content: '24時間限定セール' },
  { title: '会員募集中', content: '特典いっぱい' },
];

// ランダムな整数を生成する関数
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ポップアンダー広告の表示間隔を管理
let lastPopunderTime = 0;
const POPUNDER_INTERVAL = 5000; // 5秒に変更

// ポップアンダー広告URL (環境変数から取得するか、デフォルト値を使用)
const ADSTERRA_POPUNDER_URL = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_URL || 'https://www.adsterra.com';

const Ad: React.FC<AdProps> = ({ onClose, onMiss }) => {
  // モバイルデバイスかどうかを判定
  const [isOnMobile] = useState<boolean>(isMobile());
  
  // 使用するサイズ設定を選択
  const sizeConfig = isOnMobile ? SIZE_CONFIG.mobile : SIZE_CONFIG.desktop;
  
  // 広告の幅と高さをランダムに設定
  const [adSize, setAdSize] = useState({
    width: getRandomInt(sizeConfig.minWidth, sizeConfig.maxWidth),
    height: getRandomInt(sizeConfig.minHeight, sizeConfig.maxHeight),
  });
  
  // ×ボタンの位置をランダムに設定（右上基準でオフセット）
  const [closeButtonPos] = useState({
    top: getRandomInt(8, 12),
    right: getRandomInt(8, 12),
    size: isOnMobile ? 36 : 32, // モバイルの場合は大きめに
  });
  
  // 表示する広告コンテンツをランダムに選択
  const [adContent, setAdContent] = useState(
    AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]
  );
  
  // 広告の背景色をランダムに設定
  const [bgColor, setBgColor] = useState('');
  
  // コンポーネントがマウントされたときに背景色をランダムに設定
  useEffect(() => {
    const colors = ['#f8f9fa', '#e9ecef', '#f0f5ff', '#fff5f5', '#f6fff8'];
    setBgColor(colors[getRandomInt(0, colors.length - 1)]);
    
    // 新しい広告が表示されるたびに、サイズ、コンテンツを更新
    setAdSize({
      width: getRandomInt(sizeConfig.minWidth, sizeConfig.maxWidth),
      height: getRandomInt(sizeConfig.minHeight, sizeConfig.maxHeight),
    });
    
    setAdContent(AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]);
  }, [sizeConfig]);
  
  // 広告領域をタップしたときの処理
  const handleAdClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止
    e.stopPropagation();
    // ミスとして処理
    onMiss();
    // 分析イベント
    trackMissClick();
  };
  
  // ×ボタンをタップしたときの処理
  const handleCloseClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止
    e.stopPropagation();
    
    // 成功として処理
    onClose();
    
    // 分析イベント
    trackAdClick('main-ad');
    
    // バナー広告も更新するためにカスタムイベントを発火
    const refreshEvent = new CustomEvent(REFRESH_BANNER_EVENT);
    window.dispatchEvent(refreshEvent);
    
    // 一定時間経過していればポップアンダー広告を表示
    const now = Date.now();
    if (now - lastPopunderTime >= POPUNDER_INTERVAL) {
      lastPopunderTime = now;
      try {
        // ユーザークリックイベント内で直接ポップアンダー広告を開く
        // これによりブラウザのポップアップブロックを回避できる可能性が高まる
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl26210797.effectiveratecpm.com/20/3c/f6/203cf6d532ca4a4c4fceb543ffc78393.js';
        document.head.appendChild(script);
        console.log('ポップアンダー広告スクリプトを実行しました');
      } catch (error) {
        console.error('ポップアンダー広告の表示に失敗しました:', error);
      }
    }
  };
  
  return (
    <div 
      className="ad-container relative rounded-lg shadow-lg animate-fade-in"
      style={{ 
        width: `${adSize.width}px`, 
        height: `${adSize.height}px`,
        backgroundColor: bgColor,
        border: '1px solid rgba(0,0,0,0.1)'
      }}
      onClick={handleAdClick}
    >
      <div className="ad-content h-full flex flex-col justify-between p-4">
        <div>
          <h3 className={`font-bold text-dark ${isOnMobile ? 'text-lg' : 'text-xl'} mb-2`}>
            {adContent.title}
          </h3>
          <p className={`text-gray-600 ${isOnMobile ? 'text-sm' : 'text-base'}`}>
            {adContent.content}
          </p>
        </div>
        
        <div className="flex justify-center items-center mt-4">
          <button className={`bg-primary text-white rounded-lg ${isOnMobile ? 'px-4 py-2 text-sm' : 'px-6 py-2 text-base'} hover:bg-primary-dark transition-colors`}>
            詳細を見る
          </button>
        </div>
      </div>
      
      <button 
        className="close-button absolute bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ 
          top: `${closeButtonPos.top}px`, 
          right: `${closeButtonPos.right}px`,
          width: `${closeButtonPos.size}px`,
          height: `${closeButtonPos.size}px`,
          fontSize: isOnMobile ? '24px' : '20px',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
        onClick={handleCloseClick}
      >
        ×
      </button>
    </div>
  );
};

export default Ad;
export { REFRESH_BANNER_EVENT }; 