"use client";

import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg animate-slide-in">
      <h1 className="text-4xl font-bold text-dark mb-6">広告イレイザー</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        広告の×ボタンを素早くタップして<br />スコアを稼ごう！
      </p>
      
      <div className="mb-8">
        <p className="text-center text-gray-700">最高スコア</p>
        <p className="text-3xl font-bold text-primary text-center">{highScore}</p>
      </div>
      
      <button
        onClick={onStart}
        className="btn-primary text-lg font-semibold animate-pulse"
      >
        プレイ開始
      </button>
      
      <div className="mt-10 text-sm text-gray-500">
        <p className="mb-2">【ルール】</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>制限時間: 60秒</li>
          <li>×ボタンをタップ: +10点</li>
          <li>誤タップ: 5秒減少</li>
        </ul>
      </div>
    </div>
  );
};

export default StartScreen; 