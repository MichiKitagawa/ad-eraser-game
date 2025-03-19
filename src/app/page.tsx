"use client";

import { useState, useEffect } from 'react';
import StartScreen from '@/components/game/StartScreen';
import GameScreen from '@/components/game/GameScreen';
import ResultScreen from '@/components/game/ResultScreen';

// ゲームの状態を管理する型
type GameState = 'start' | 'playing' | 'result';

export default function Home() {
  // ゲームの状態を管理
  const [gameState, setGameState] = useState<GameState>('start');
  // 現在のスコア
  const [currentScore, setCurrentScore] = useState<number>(0);
  // 最高スコア（ローカルストレージから取得）
  const [highScore, setHighScore] = useState<number>(0);

  // コンポーネントがマウントされたときに最高スコアを取得
  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  // ゲームをスタートする関数
  const startGame = () => {
    setGameState('playing');
    setCurrentScore(0);
  };

  // ゲームを終了し、結果画面に遷移する関数
  const endGame = (finalScore: number) => {
    setCurrentScore(finalScore);
    
    // 最高スコアを更新する場合
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('highScore', finalScore.toString());
    }
    
    setGameState('result');
  };

  // ホーム画面に戻る関数
  const goToHome = () => {
    setGameState('start');
  };

  // 現在のゲーム状態に応じてコンポーネントを表示
  return (
    <div className="w-full max-w-md mx-auto">
      {gameState === 'start' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <GameScreen onGameEnd={endGame} />
      )}
      
      {gameState === 'result' && (
        <ResultScreen 
          score={currentScore} 
          highScore={highScore} 
          onRetry={startGame}
          onHome={goToHome}
        />
      )}
    </div>
  );
} 