"use client";

import React, { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { saveScore, getTopScores, getUserRank, Score } from '@/services/score/scoreService';

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

  // ランキングデータの状態
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  // ランキングデータを取得
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // トップスコアを取得
        const scores = await getTopScores(10);
        setTopScores(scores);
        
        // 現在のスコアのランクを取得
        if (score > 0) {
          const rank = await getUserRank(score);
          setUserRank(rank);
        }
      } catch (error) {
        console.error('ランキング取得エラー:', error);
        setErrorMessage('ランキングの取得に失敗しました');
      }
    };
    
    fetchRanking();
  }, [score]);

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

  // スコアを送信する処理
  const handleSubmitScore = async () => {
    if (!userName.trim()) {
      setErrorMessage('名前を入力してください');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const success = await saveScore(userName, score);
      if (success) {
        setIsSubmitted(true);
        
        // 送信後に再度ランキングを取得して表示を更新
        const scores = await getTopScores(10);
        setTopScores(scores);
      } else {
        setErrorMessage('スコアの登録に失敗しました');
      }
    } catch (error) {
      console.error('スコア送信エラー:', error);
      setErrorMessage('スコアの登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
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
      
      {!isSubmitted && score > 0 ? (
        <div className="mb-8 w-full max-w-xs">
          <p className="text-center text-gray-700 mb-2">ランキングに登録</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="あなたの名前"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              maxLength={10}
            />
            <button
              onClick={handleSubmitScore}
              disabled={isSubmitting || !userName.trim()}
              className="btn-primary font-semibold"
            >
              {isSubmitting ? '送信中...' : '送信'}
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            あなたの順位: {userRank > 0 ? `${userRank}位` : '計算中...'}
          </p>
        </div>
      ) : null}
      
      <div className="flex space-x-4 mb-8">
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
      
      <div className="w-full">
        <p className="text-center text-gray-700 mb-2">ランキング</p>
        <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
          {topScores.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left p-2">順位</th>
                  <th className="text-left p-2">名前</th>
                  <th className="text-right p-2">スコア</th>
                </tr>
              </thead>
              <tbody>
                {topScores.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-200 ${item.user_name === userName && isSubmitted ? 'bg-yellow-100' : ''}`}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.user_name}</td>
                    <td className="text-right p-2">{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">ランキングデータを読み込み中...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen; 