"use client";

import React from 'react';

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
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg animate-slide-in">
      <h2 className="text-3xl font-bold text-dark mb-6">ゲーム終了</h2>
      
      <div className="mb-8 text-center">
        <p className="text-xl text-gray-700 mb-2">あなたのスコア</p>
        <p className="text-5xl font-bold text-primary mb-2">{score}</p>
        
        {isNewHighScore && (
          <p className="text-lg text-accent font-semibold animate-pulse">新記録達成！</p>
        )}
      </div>
      
      <div className="mb-8">
        <p className="text-center text-gray-700">最高スコア</p>
        <p className="text-2xl font-bold text-secondary text-center">{highScore}</p>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={onRetry}
          className="btn-primary font-semibold"
        >
          リトライ
        </button>
        
        <button
          onClick={onHome}
          className="btn-secondary font-semibold"
        >
          ホームへ
        </button>
      </div>
      
      {/* ここにランキング実装予定 */}
      <div className="mt-8 w-full">
        <p className="text-center text-gray-700 mb-2">ランキング</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-center text-gray-500">ランキング機能は開発中です</p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen; 