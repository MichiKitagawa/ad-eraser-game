"use client";

import React, { useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { trackGameStart } from '@/lib/matomo';
import { loadAdSterraScript } from '@/services/ads/adService';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  // 効果音の使用
  const { play, toggleSound, isSoundEnabled } = useSound();

  // 音声設定をアイコンで表示
  const soundIcon = isSoundEnabled() ? '🔊' : '🔇';

  // スタートボタンのクリック処理
  const handleStart = () => {
    play('gameStart');
    onStart();
  };

  // サウンド設定の切り替え
  const handleToggleSound = () => {
    toggleSound();
    play('buttonClick');
  };

  // コンポーネントがマウントされたときの効果
  useEffect(() => {
    // ページロード時に効果音
    play('buttonClick');
    
    // ゲーム開始前に広告スクリプトを読み込んでおく（ページ読み込み時に一度だけ）
    try {
      loadAdSterraScript();
      console.log('ゲーム準備: AdSterraスクリプトを読み込みました');
    } catch (error) {
      console.error('AdSterraスクリプト読み込み中にエラーが発生しました:', error);
    }
  }, [play]);

  // ゲーム開始時のトラッキング
  useEffect(() => {
    // ゲーム開始イベントを記録
    trackGameStart();
  }, []);

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
        onClick={handleStart}
        className="btn-primary text-lg font-semibold animate-pulse px-8 py-3"
      >
        プレイ開始
      </button>
      
      <div className="mt-10 text-sm text-gray-500">
        <p className="mb-2">【ルール】</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>制限時間: 60秒</li>
          <li>×ボタンをタップ: +10点</li>
          <li>誤タップ: 5秒減少</li>
          <li>連続成功でコンボボーナス！</li>
        </ul>
      </div>

      <div className="mt-5 text-xs text-gray-400 max-w-xs text-center">
        <p>このゲームには広告が含まれています。プレイすることで、広告が表示される場合があります。</p>
        <p className="mt-1">スコアはオンラインランキングに登録できます。</p>
      </div>

      {/* サウンド設定ボタン */}
      <button
        onClick={handleToggleSound}
        className="mt-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label={isSoundEnabled() ? "サウンドをオフにする" : "サウンドをオンにする"}
      >
        <span className="text-2xl">{soundIcon}</span>
      </button>
    </div>
  );
};

export default StartScreen; 