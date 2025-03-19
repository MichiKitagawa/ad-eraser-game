"use client";

import React, { useState, useEffect } from 'react';

interface AdProps {
  onClose: () => void;
  onMiss: () => void;
}

// 広告のサイズと×ボタンの位置のランダム設定のための定数
const MIN_WIDTH = 280;
const MAX_WIDTH = 320;
const MIN_HEIGHT = 180;
const MAX_HEIGHT = 250;

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
  
  // ×ボタンの位置をランダムに設定（右上基準でオフセット）
  const [closeButtonPos, setCloseButtonPos] = useState({
    top: getRandomInt(5, 15),
    right: getRandomInt(5, 15),
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
      width: getRandomInt(MIN_WIDTH, MAX_WIDTH),
      height: getRandomInt(MIN_HEIGHT, MAX_HEIGHT),
    });
    
    setCloseButtonPos({
      top: getRandomInt(5, 15),
      right: getRandomInt(5, 15),
    });
    
    setAdContent(AD_CONTENTS[getRandomInt(0, AD_CONTENTS.length - 1)]);
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
    // 成功として処理
    onClose();
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
          top: `${closeButtonPos.top}px`, 
          right: `${closeButtonPos.right}px` 
        }}
        onClick={handleCloseClick}
      >
        ×
      </button>
    </div>
  );
};

export default Ad; 