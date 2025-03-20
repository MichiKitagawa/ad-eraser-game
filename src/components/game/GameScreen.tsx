"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Ad from '@/components/ads/Ad';
import CornerAd from '@/components/ads/CornerAd';
import { useSound } from '@/hooks/useSound';

interface GameScreenProps {
  onGameEnd: (score: number) => void;
}

// ゲームの状態を管理する型
interface GameState {
  timeLeft: number;
  score: number;
  adKey: number; // 広告を強制的に再レンダリングするためのキー
  combo: number; // 連続成功回数
  isShaking: boolean; // 画面シェイク用
}

// スコアポップアップ用の型
interface ScorePopup {
  id: number;
  value: number;
  x: number;
  y: number;
}

const GAME_DURATION = 60; // ゲーム時間（秒）
const TIME_PENALTY = 5; // 誤タップのペナルティ（秒）
const SCORE_INCREMENT = 10; // 成功時の基本得点
const COMBO_BONUS = 2; // コンボボーナス（コンボ数ごとに加算）
const CORNER_AD_REFRESH_INTERVAL = 10000; // 背景広告の更新間隔（ミリ秒）

const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  // 効果音の使用
  const { play } = useSound();

  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: GAME_DURATION,
    score: 0,
    adKey: 0,
    combo: 0,
    isShaking: false,
  });
  
  // 背景広告の状態を管理
  const [cornerAdKeys, setCornerAdKeys] = useState<number[]>([0, 1, 2, 3]);
  
  // スコアポップアップ効果を管理
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  
  // タイマーの処理
  useEffect(() => {
    if (gameState.timeLeft <= 0) {
      // 時間切れでゲーム終了
      play('gameEnd');
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
  }, [gameState.timeLeft, gameState.score, onGameEnd, play]);

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
  const handleAdClose = useCallback((e?: React.MouseEvent) => {
    // 効果音を再生
    play('adClosed');

    // タップ位置の取得（ポップアップ表示位置用）
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    
    // コンボ数の計算
    const newCombo = gameState.combo + 1;
    
    // コンボ数に応じたスコア加算
    const comboScore = SCORE_INCREMENT + Math.floor(newCombo / 3) * COMBO_BONUS;
    
    // スコアポップアップ効果を追加
    const newPopup: ScorePopup = {
      id: Date.now(),
      value: comboScore,
      x,
      y,
    };
    
    setScorePopups(prev => [...prev, newPopup]);
    
    // スコアを加算
    setGameState(prev => ({
      ...prev,
      score: prev.score + comboScore,
      adKey: prev.adKey + 1, // 新しい広告を表示するためにキーを変更
      combo: newCombo,
    }));

    // ポップアップを一定時間後に削除
    setTimeout(() => {
      setScorePopups(prev => prev.filter(popup => popup.id !== newPopup.id));
    }, 1000);
  }, [gameState.combo, play]);

  // 広告の誤タップ時の処理
  const handleAdMiss = useCallback(() => {
    // 効果音を再生
    play('adMiss');

    // シェイクアニメーションの開始
    setGameState(prev => ({
      ...prev,
      isShaking: true,
      combo: 0, // コンボリセット
      timeLeft: Math.max(0, prev.timeLeft - TIME_PENALTY),
    }));
    
    // アニメーション終了
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isShaking: false,
      }));
    }, 500);
  }, [play]);

  // 残り時間が10秒以下の場合の警告スタイル
  const timerClass = gameState.timeLeft <= 10 
    ? 'timer text-red-500 animate-pulse' 
    : 'timer';

  // 画面シェイクのクラス
  const containerClass = gameState.isShaking 
    ? 'game-container animate-shake' 
    : 'game-container animate-fade-in';

  return (
    <div className={containerClass}>
      <div className="game-header">
        <div className={timerClass}>
          残り時間: {gameState.timeLeft}秒
        </div>
        <div className="score">
          スコア: {gameState.score}
          {gameState.combo > 1 && (
            <span className="ml-2 text-xs">
              {gameState.combo}コンボ!
            </span>
          )}
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
        
        {/* スコアポップアップ */}
        {scorePopups.map(popup => (
          <div
            key={popup.id}
            className="absolute animate-score-popup text-lg font-bold text-primary"
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            +{popup.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen; 