"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Ad from '@/components/ads/Ad';
import CornerAd from '@/components/ads/CornerAd';

interface GameScreenProps {
  onGameEnd: (score: number) => void;
}

// ゲームの状態を管理する型
interface GameState {
  timeLeft: number;
  score: number;
  adKey: number; // 広告を強制的に再レンダリングするためのキー
}

const GAME_DURATION = 60; // ゲーム時間（秒）
const TIME_PENALTY = 5; // 誤タップのペナルティ（秒）
const SCORE_INCREMENT = 10; // 成功時の得点
const CORNER_AD_REFRESH_INTERVAL = 10000; // 背景広告の更新間隔（ミリ秒）

const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: GAME_DURATION,
    score: 0,
    adKey: 0,
  });
  
  // 背景広告の状態を管理
  const [cornerAdKeys, setCornerAdKeys] = useState<number[]>([0, 1, 2, 3]);
  
  // タイマーの処理
  useEffect(() => {
    if (gameState.timeLeft <= 0) {
      // 時間切れでゲーム終了
      onGameEnd(gameState.score);
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
  }, [gameState.timeLeft, gameState.score, onGameEnd]);

  // 背景広告を更新する処理
  useEffect(() => {
    const refreshCornerAds = () => {
      setCornerAdKeys(prev => prev.map(() => Math.random()));
    };

    // 指定間隔で背景広告を更新
    const adRefreshTimer = setInterval(refreshCornerAds, CORNER_AD_REFRESH_INTERVAL);
    
    return () => clearInterval(adRefreshTimer);
  }, []);

  // 広告の×ボタンをタップした時の処理
  const handleAdClose = useCallback(() => {
    // スコアを加算
    setGameState(prev => ({
      ...prev,
      score: prev.score + SCORE_INCREMENT,
      adKey: prev.adKey + 1, // 新しい広告を表示するためにキーを変更
    }));

    // ポップアンダー広告を表示する処理
    // 注: 本番環境では実際の広告ネットワークのAPIを使用
    // 開発中はここで実装しない
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
    <div className="game-container animate-fade-in">
      <div className="game-header">
        <div className="timer">
          残り時間: {gameState.timeLeft}秒
        </div>
        <div className="score">
          スコア: {gameState.score}
        </div>
      </div>
      
      <div className="game-content">
        {/* 中央の消す対象の広告 */}
        <Ad 
          key={gameState.adKey}
          onClose={handleAdClose}
          onMiss={handleAdMiss}
        />
        
        {/* 四隅の背景広告 */}
        <CornerAd position="top-left" key={`corner-0-${cornerAdKeys[0]}`} />
        <CornerAd position="top-right" key={`corner-1-${cornerAdKeys[1]}`} />
        <CornerAd position="bottom-left" key={`corner-2-${cornerAdKeys[2]}`} />
        <CornerAd position="bottom-right" key={`corner-3-${cornerAdKeys[3]}`} />
      </div>
    </div>
  );
};

export default GameScreen; 