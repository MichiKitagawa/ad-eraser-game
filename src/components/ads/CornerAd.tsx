"use client";

import React from 'react';

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

// ランダムな広告テキストを選択
const getRandomAdText = () => {
  return AD_TEXTS[Math.floor(Math.random() * AD_TEXTS.length)];
};

const CornerAd: React.FC<CornerAdProps> = ({ position }) => {
  // 位置に応じたクラス名を設定
  const positionClassName = `corner-ad ${position}-ad`;
  
  // ランダムな広告テキスト
  const adText = getRandomAdText();
  
  return (
    <div className={positionClassName}>
      <div className="text-center">
        <div className="text-xs font-bold mb-1">広告</div>
        <div>{adText}</div>
      </div>
    </div>
  );
};

export default CornerAd; 