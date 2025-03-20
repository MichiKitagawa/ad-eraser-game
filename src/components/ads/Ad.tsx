"use client";

import React, { useState, useEffect, useRef } from 'react';

interface AdProps {
  onClose: () => void;
  onMiss: () => void;
}

// 広告のサイズと×ボタンの位置のランダム設定のための定数
const MIN_WIDTH = 260;
const MAX_WIDTH = 320;
const MIN_HEIGHT = 160;
const MAX_HEIGHT = 250;
const MIN_CLOSE_SIZE = 24; // モバイル用に大きめに設定
const MAX_CLOSE_SIZE = 32;

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

const Ad: React.FC<AdProps> = ({ onClose, onMiss }) => {
  // 広告の幅と高さをランダムに設定
  const [adSize, setAdSize] = useState({
    width: getRandomInt(MIN_WIDTH, MAX_WIDTH),
    height: getRandomInt(MIN_HEIGHT, MAX_HEIGHT),
  });
  
  // ×ボタンの位置とサイズをランダムに設定
  const [closeButtonProps, setCloseButtonProps] = useState({
    top: getRandomInt(5, 15),
    right: getRandomInt(5, 15),
    size: getRandomInt(MIN_CLOSE_SIZE, MAX_CLOSE_SIZE),
  });
  
  // 表示する広告コンテンツをランダムに選択
  const [adContent, setAdContent] = useState(
    AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]
  );
  
  // 広告の背景色をランダムに設定
  const [bgColor, setBgColor] = useState('');

  // 消滅アニメーション用の状態
  const [isClosing, setIsClosing] = useState(false);
  
  // アニメーション完了判定用のタイマー参照
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // コンポーネントがマウントされたときに背景色をランダムに設定
  useEffect(() => {
    const colors = ['#f8f9fa', '#e9ecef', '#f0f5ff', '#fff5f5', '#f6fff8'];
    setBgColor(colors[getRandomInt(0, colors.length - 1)]);
    
    // 新しい広告が表示されるたびに、サイズ、位置、コンテンツを更新
    setAdSize({
      width: getRandomInt(MIN_WIDTH, MAX_WIDTH),
      height: getRandomInt(MIN_HEIGHT, MAX_HEIGHT),
    });
    
    setCloseButtonProps({
      top: getRandomInt(5, 15),
      right: getRandomInt(5, 15),
      size: getRandomInt(MIN_CLOSE_SIZE, MAX_CLOSE_SIZE),
    });
    
    setAdContent(AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]);

    // クリーンアップ関数
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);
  
  // 広告領域をタップしたときの処理
  const handleAdClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止
    e.stopPropagation();
    // ミスとして処理
    onMiss();
  };
  
  // ×ボタンをタップしたときの処理
  const handleCloseClick = (e: React.MouseEvent) => {
    // イベントの伝播を停止
    e.stopPropagation();
    // 消滅アニメーションを開始
    setIsClosing(true);
    
    // アニメーション完了後に成功として処理
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, 300); // アニメーション時間に合わせる
  };
  
  // アニメーションクラスの設定
  const animationClass = isClosing ? 'animate-pop-out' : 'animate-slide-in';
  
  return (
    <div 
      className={`ad-container ${animationClass}`}
      style={{ 
        width: `${adSize.width}px`, 
        height: `${adSize.height}px`,
        backgroundColor: bgColor
      }}
      onClick={handleAdClick}
    >
      <div className="ad-content h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-dark">{adContent.title}</h3>
          <p className="text-gray-600">{adContent.content}</p>
        </div>
        
        <div className="flex justify-center items-center mt-4">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
            詳細を見る
          </button>
        </div>
      </div>
      
      <button 
        className="close-button"
        style={{ 
          top: `${closeButtonProps.top}px`, 
          right: `${closeButtonProps.right}px`,
          width: `${closeButtonProps.size}px`,
          height: `${closeButtonProps.size}px`,
        }}
        onClick={handleCloseClick}
      >
        ×
      </button>
    </div>
  );
};

export default Ad; 