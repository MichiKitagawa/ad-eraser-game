"use client";

import React, { useEffect, useRef } from 'react';
import { insertBannerAd, isMobile } from '@/services/ads/adService';
import { trackAdImpression } from '@/lib/matomo';

// 背景広告の位置タイプ
type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerAdProps {
  position: CornerPosition;
}

// ダミー広告テキスト
const AD_TEXTS = [
  'おすすめ商品',
  'セール中',
  '新規登録特典',
  'ポイント2倍',
  'お得な情報',
  '期間限定',
  'キャンペーン',
  '特別オファー'
];

// 広告サイズ設定
const AD_SIZES = {
  desktop: {
    width: 320,
    height: 50
  },
  mobile: {
    width: 320,
    height: 50
  }
};

// ランダムな広告テキストを選択
const getRandomAdText = () => {
  return AD_TEXTS[Math.floor(Math.random() * AD_TEXTS.length)];
};

// 位置に基づいたスタイルを計算する関数
const getPositionStyle = (position: CornerPosition, isOnMobile: boolean) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    width: isOnMobile ? AD_SIZES.mobile.width : AD_SIZES.desktop.width,
    height: isOnMobile ? AD_SIZES.mobile.height : AD_SIZES.desktop.height,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  // 位置に応じたスタイルを追加
  switch(position) {
    case 'top-left':
      return {
        ...baseStyle,
        top: 0,
        left: 0,
        borderBottomRightRadius: '4px'
      };
    case 'top-right':
      return {
        ...baseStyle,
        top: 0,
        right: 0,
        borderBottomLeftRadius: '4px'
      };
    case 'bottom-left':
      return {
        ...baseStyle,
        bottom: 0,
        left: 0,
        borderTopRightRadius: '4px'
      };
    case 'bottom-right':
      return {
        ...baseStyle,
        bottom: 0,
        right: 0,
        borderTopLeftRadius: '4px'
      };
    default:
      return baseStyle;
  }
};

const CornerAd: React.FC<CornerAdProps> = ({ position }) => {
  // モバイル判定
  const isOnMobile = isMobile();
  
  // 位置に応じたスタイルを取得
  const positionStyle = getPositionStyle(position, isOnMobile);
  
  // ランダムな広告テキスト
  const adText = getRandomAdText();
  
  // 広告コンテナの参照
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  // 広告IDを生成
  const adId = `corner-ad-${position}`;
  
  // 広告の初期化
  useEffect(() => {
    if (adContainerRef.current) {
      // 実際の広告を挿入
      insertBannerAd(adId);
      
      // 広告表示イベントを記録
      trackAdImpression('corner');
      
      console.log(`Corner ad inserted: ${adId}, size: ${isOnMobile ? 'mobile' : 'desktop'}`);
    }
    
    // このコンポーネントが再レンダリングされるたびに広告を更新（keyプロップが変更されたとき）
    return () => {
      console.log(`Corner ad ${position} refreshed`);
    };
  }, [adId, position, isOnMobile]);
  
  return (
    <div 
      id={adId}
      ref={adContainerRef}
      className={`corner-ad ${position}-ad`}
      style={positionStyle}
    >
      <div className="text-center w-full h-full flex items-center justify-center">
        <div>
          <div className="text-xs font-bold mb-1">広告</div>
          <div className="text-sm">{adText}</div>
        </div>
      </div>
    </div>
  );
};

export default CornerAd; 