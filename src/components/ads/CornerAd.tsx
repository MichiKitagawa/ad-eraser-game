"use client";

import React, { useState, useEffect } from 'react';

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

// 背景色のバリエーション
const BG_COLORS = [
  '#f0f5ff', // 薄い青
  '#fff0f6', // 薄いピンク
  '#f6ffed', // 薄い緑
  '#fffbe6', // 薄い黄色
  '#f9f0ff', // 薄い紫
];

// ランダムな広告テキストを選択
const getRandomAdText = () => {
  return AD_TEXTS[Math.floor(Math.random() * AD_TEXTS.length)];
};

// ランダムな背景色を選択
const getRandomBgColor = () => {
  return BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
};

const CornerAd: React.FC<CornerAdProps> = ({ position }) => {
  // 位置に応じたクラス名を設定
  const positionClassName = `corner-ad ${position}-ad`;
  
  // ランダムな広告テキスト
  const [adText, setAdText] = useState(getRandomAdText());
  
  // 背景色
  const [bgColor, setBgColor] = useState(getRandomBgColor());
  
  // リフレッシュ状態（アニメーション用）
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 広告のリフレッシュ効果
  useEffect(() => {
    // 既存の広告テキストと背景色を保存
    const oldAdText = adText;
    const oldBgColor = bgColor;
    
    // 新しいランダムな値を生成（既存と異なるものを確保）
    let newAdText;
    let newBgColor;
    
    do {
      newAdText = getRandomAdText();
    } while (newAdText === oldAdText);
    
    do {
      newBgColor = getRandomBgColor();
    } while (newBgColor === oldBgColor);
    
    // リフレッシュアニメーションを開始
    setIsRefreshing(true);
    
    // アニメーション後に新しい値を設定
    const timer = setTimeout(() => {
      setAdText(newAdText);
      setBgColor(newBgColor);
      setIsRefreshing(false);
    }, 300); // フェードアウト時間
    
    return () => clearTimeout(timer);
  }, [position]); // position が変わった時のみ実行
  
  // アニメーションクラス
  const animationClass = isRefreshing ? 'animate-fade-out' : 'animate-fade-in';
  
  return (
    <div 
      className={`${positionClassName} ${animationClass}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-center">
        <div className="text-xs font-bold mb-1">広告</div>
        <div>{adText}</div>
      </div>
    </div>
  );
};

export default CornerAd; 