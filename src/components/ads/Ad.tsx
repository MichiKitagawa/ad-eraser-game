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
    minWidth: 220,
    maxWidth: 280,
    minHeight: 150,
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
  // モバイル向けにボタンを大きくするためのパラメータも調整
  const [closeButtonPos, setCloseButtonPos] = useState({
    top: getRandomInt(5, 15),
    right: getRandomInt(5, 15),
    size: isOnMobile ? 30 : 24, // モバイルの場合は大きめに
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
    
    // 新しい広告が表示されるたびに、サイズ、位置、コンテンツを更新
    setAdSize({
      width: getRandomInt(sizeConfig.minWidth, sizeConfig.maxWidth),
      height: getRandomInt(sizeConfig.minHeight, sizeConfig.maxHeight),
    });
    
    setCloseButtonPos({
      top: getRandomInt(5, 15),
      right: getRandomInt(5, 15),
      size: isOnMobile ? 30 : 24,
    });
    
    setAdContent(AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]);
  }, [sizeConfig, isOnMobile]);
  
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
        const popWindow = window.open(ADSTERRA_POPUNDER_URL, '_blank');
        
        // ポップアップブロックの検出
        if (!popWindow || popWindow.closed || typeof popWindow.closed === 'undefined') {
          console.warn('ポップアップがブロックされている可能性があります');
        } else {
          console.log('ポップアンダー広告をユーザーアクション内で直接表示しました');
        }
      } catch (error) {
        console.error('ポップアンダー広告の表示に失敗しました:', error);
      }
    }
  };
  
  return (
    <div 
      className="ad-container animate-fade-in"
      style={{ 
        width: `${adSize.width}px`, 
        height: `${adSize.height}px`,
        backgroundColor: bgColor
      }}
      onClick={handleAdClick}
    >
      <div className="ad-content h-full flex flex-col justify-between">
        <div>
          <h3 className={`font-bold text-dark ${isOnMobile ? 'text-base' : 'text-lg'}`}>
            {adContent.title}
          </h3>
          <p className={`text-gray-600 ${isOnMobile ? 'text-sm' : ''}`}>
            {adContent.content}
          </p>
        </div>
        
        <div className="flex justify-center items-center mt-4">
          <button className={`bg-primary text-white rounded-lg ${isOnMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}`}>
            詳細を見る
          </button>
        </div>
      </div>
      
      <button 
        className="close-button"
        style={{ 
          top: `${closeButtonPos.top}px`, 
          right: `${closeButtonPos.right}px`,
          width: `${closeButtonPos.size}px`,
          height: `${closeButtonPos.size}px`,
          fontSize: isOnMobile ? '18px' : '16px'
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