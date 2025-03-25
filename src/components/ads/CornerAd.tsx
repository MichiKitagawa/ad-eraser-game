"use client";

import React, { useEffect, useRef } from 'react';
import { insertBannerAd } from '@/services/ads/adService';
import { trackAdImpression } from '@/lib/matomo';

interface BannerAdProps {
  className?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ className = '' }) => {
  // 広告コンテナの参照
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  // 広告IDを生成
  const adId = 'bottom-banner-ad';
  
  // 広告の初期化
  useEffect(() => {
    if (adContainerRef.current) {
      // 実際の広告を挿入
      insertBannerAd(adId);
      
      // 広告表示イベントを記録
      trackAdImpression('banner');
      
      console.log('Bottom banner ad inserted');
    }
    
    // コンポーネントがアンマウントされたときのクリーンアップ
    return () => {
      console.log('Bottom banner ad removed');
    };
  }, []);
  
  return (
    <div 
      id={adId}
      ref={adContainerRef}
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-t-lg overflow-hidden z-50 ${className}`}
      style={{ 
        width: '300px',
        height: '250px',
        minHeight: '250px'
      }}
    >
      <div className="text-center w-full h-full flex items-center justify-center">
        <div>
          <div className="text-xs font-bold mb-1">広告</div>
          <div className="text-sm">読み込み中...</div>
        </div>
      </div>
    </div>
  );
};

export default BannerAd; 