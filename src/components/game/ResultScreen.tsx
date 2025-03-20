"use client";

import React, { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';

interface ResultScreenProps {
  score: number;
  highScore: number;
  onRetry: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  score, 
  highScore, 
  onRetry, 
  onHome 
}) => {
  // 効果音の使用
  const { play } = useSound();
  
  const isNewHighScore = score > 0 && score >= highScore;
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  // コンポーネントのマウント時に効果音を再生
  useEffect(() => {
    play('gameEnd');
  }, [play]);

  // スコアをアニメーションしながら表示する効果
  useEffect(() => {
    if (score <= 0) {
      setDisplayScore(0);
      setAnimationComplete(true);
      return;
    }

    // スコアをカウントアップするアニメーション
    const duration = 1500; // ミリ秒
    const interval = 15; // 更新間隔
    const steps = Math.floor(duration / interval);
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), score);
      setDisplayScore(current);

      if (current >= score) {
        clearInterval(timer);
        setAnimationComplete(true);
        
        // スコアカウントが完了したときに高得点の場合は特別な効果音
        if (isNewHighScore) {
          play('newHighScore');
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [score, isNewHighScore, play]);

  // アニメーションクラスの設定
  const scoreClass = isNewHighScore && animationComplete 
    ? 'text-5xl font-bold text-primary mb-2 animate-pulse' 
    : 'text-5xl font-bold text-primary mb-2';

  // ボタンクリック時の効果音
  const handleRetryWithSound = () => {
    play('buttonClick');
    onRetry();
  };

  const handleHomeWithSound = () => {
    play('buttonClick');
    onHome();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg animate-slide-in">
      <h2 className="text-3xl font-bold text-dark mb-6">ゲーム終了</h2>
      
      <div className="mb-8 text-center">
        <p className="text-xl text-gray-700 mb-2">あなたのスコア</p>
        <p className={scoreClass}>{displayScore}</p>
        
        {isNewHighScore && animationComplete && (
          <div className="text-lg text-accent font-semibold animate-bounce py-2">
            新記録達成！🎉
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <p className="text-center text-gray-700">最高スコア</p>
        <p className="text-2xl font-bold text-secondary text-center">{highScore}</p>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleRetryWithSound}
          className="btn-primary font-semibold transition-transform hover:scale-105"
        >
          リトライ
        </button>
        
        <button
          onClick={handleHomeWithSound}
          className="btn-secondary font-semibold transition-transform hover:scale-105"
        >
          ホームへ
        </button>
      </div>
      
      {/* 最近のスコア履歴 */}
      <div className="mt-8 w-full">
        <p className="text-center text-gray-700 mb-2">スコア履歴</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between">
            <p className="font-semibold">今回のスコア</p>
            <p>{score}</p>
          </div>
          {isNewHighScore ? (
            <div className="flex justify-between mt-2 text-accent">
              <p className="font-semibold">前回の最高スコア</p>
              <p>{highScore !== score ? highScore : '初めての記録！'}</p>
            </div>
          ) : (
            <div className="flex justify-between mt-2">
              <p className="font-semibold">最高スコアとの差</p>
              <p>-{highScore - score}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen; 