"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Ad, { REFRESH_BANNER_EVENT } from '@/components/ads/Ad';
import CornerAd from '@/components/ads/CornerAd';
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
  
  // 背景広告の状態を管理
  const [cornerAdKeys, setCornerAdKeys] = useState<number[]>([0, 1, 2, 3]);
  
  // 開始時間
  const [startTime] = useState<number>(Date.now());
  
  // ゲーム開始時のトラッキングと広告初期化
  useEffect(() => {
    // ゲーム開始イベントを記録
    trackGameStart();
    
    // 初期広告を更新
    setCornerAdKeys([Math.random(), Math.random(), Math.random(), Math.random()]);
    
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

  // 背景広告を更新する処理
  useEffect(() => {
    const refreshCornerAds = () => {
      console.log('バナー広告を更新します');
      setCornerAdKeys(prev => prev.map(() => Math.random()));
    };

    // 指定間隔で背景広告を更新
    const adRefreshTimer = setInterval(refreshCornerAds, adConfig.bannerRefreshInterval);
    console.log(`バナー広告更新タイマーを設定しました: ${adConfig.bannerRefreshInterval}ms`);
    
    // Adコンポーネントからのイベントを受け取り、バナー広告を更新
    const handleAdRefreshEvent = () => {
      console.log('広告クリックイベントを受信: バナー広告を更新します');
      refreshCornerAds();
    };
    
    // イベントリスナーを登録
    window.addEventListener(REFRESH_BANNER_EVENT, handleAdRefreshEvent);
    
    return () => {
      clearInterval(adRefreshTimer);
      window.removeEventListener(REFRESH_BANNER_EVENT, handleAdRefreshEvent);
    };
  }, [adConfig.bannerRefreshInterval]);

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
    <div className="game-container animate-fade-in">
      <div className="game-header">
        <div className="timer">
          残り時間: {gameState.timeLeft}秒
        </div>
        <div className="score">
          スコア: {gameState.score}
        </div>
      </div>
      
      <div className="game-content relative">
        {/* 中央の消す対象の広告 */}
        <Ad 
          key={gameState.adKey}
          onClose={handleAdClose}
          onMiss={handleAdMiss}
        />
        
        {/* 四隅の背景広告 - モバイル最適化した位置指定 */}
        <CornerAd position="top-left" key={`corner-0-${cornerAdKeys[0]}`} />
        <CornerAd position="top-right" key={`corner-1-${cornerAdKeys[1]}`} />
        <CornerAd position="bottom-left" key={`corner-2-${cornerAdKeys[2]}`} />
        <CornerAd position="bottom-right" key={`corner-3-${cornerAdKeys[3]}`} />
      </div>
    </div>
  );
};

export default GameScreen; 