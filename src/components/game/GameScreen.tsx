"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Ad, { REFRESH_BANNER_EVENT } from '@/components/ads/Ad';
// BannerAdモジュールが見つからないエラーを修正
// import BannerAd from '@/components/ads/BannerAd';
import { trackGameStart, trackGameEnd } from '@/lib/matomo';
import { getAdConfig, isMobile } from '@/services/ads/adService';

interface GameScreenProps {
  onGameEnd: (score: number) => void;
}

// ゲームの状態を管理する型
interface GameState {
  timeLeft: number;
  score: number;
  adKey: number; // 広告を強制的に再レンダリングするためのキー
}

const GAME_DURATION = 30; // ゲーム時間（秒）
const TIME_PENALTY = 5; // 誤タップのペナルティ（秒）
const SCORE_INCREMENT = 10; // 成功時の得点

const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  // 広告設定を取得
  const adConfig = getAdConfig();
  
  // モバイルデバイスかどうかを検出
  const [isOnMobile] = useState<boolean>(isMobile());
  
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: GAME_DURATION,
    score: 0,
    adKey: 0,
  });
  
  // 開始時間
  const [startTime] = useState<number>(Date.now());
  
  // ゲーム開始時のトラッキング
  useEffect(() => {
    // ゲーム開始イベントを記録
    trackGameStart();
    console.log('ゲーム画面が初期化されました', isOnMobile ? 'モバイル' : 'デスクトップ');
  }, [isOnMobile]);
  
  // タイマーの処理
  useEffect(() => {
    if (gameState.timeLeft <= 0) {
      // ゲームの持続時間を計算（秒）
      const gameDuration = Math.round((Date.now() - startTime) / 1000);
      
      // 時間切れでゲーム終了
      onGameEnd(gameState.score);
      
      // ゲーム終了イベントをトラッキング
      trackGameEnd(gameState.score, gameDuration);
      return;
    }

    // 1秒ごとにタイマーを更新
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeLeft: prev.timeLeft - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.timeLeft, gameState.score, onGameEnd, startTime]);

  // 広告の×ボタンをタップした時の処理
  const handleAdClose = useCallback(() => {
    // スコアを加算
    setGameState(prev => ({
      ...prev,
      score: prev.score + SCORE_INCREMENT,
      adKey: prev.adKey + 1, // 新しい広告を表示するためにキーを変更
    }));
  }, []);

  // 広告の誤タップ時の処理
  const handleAdMiss = useCallback(() => {
    // ペナルティとして時間を減少
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(0, prev.timeLeft - TIME_PENALTY),
    }));
  }, []);

  return (
    <div className="game-container relative min-h-screen bg-gray-100 animate-fade-in">
      {/* ゲームヘッダー */}
      <div className="game-header fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="timer text-xl font-bold">
            残り時間: {gameState.timeLeft}秒
          </div>
          <div className="score text-xl font-bold text-primary">
            スコア: {gameState.score}
          </div>
        </div>
      </div>

      {/* メインゲームエリア */}
      <div className="game-content pt-20 pb-[300px] min-h-screen flex items-center justify-center">
        {/* 中央の消す対象の広告 */}
        <Ad 
          key={gameState.adKey}
          onClose={handleAdClose}
          onMiss={handleAdMiss}
        />
      </div>
      {/* 下部の広告 */}
      {/* BannerAdコンポーネントがインポートされていないため、コメントアウトまたは削除します */}
      {/* <BannerAd /> */}
    </div>
  );
};

export default GameScreen; 