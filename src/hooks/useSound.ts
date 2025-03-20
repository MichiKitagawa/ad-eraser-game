/**
 * 効果音を管理するためのカスタムフック
 */

import { useRef, useCallback, useEffect } from 'react';

interface SoundFile {
  id: string;
  src: string;
}

// 効果音ファイルの定義（public/soundsディレクトリに配置する想定）
const SOUND_FILES: SoundFile[] = [
  { id: 'adClosed', src: '/sounds/pop.mp3' },
  { id: 'adMiss', src: '/sounds/error.mp3' },
  { id: 'gameStart', src: '/sounds/start.mp3' },
  { id: 'gameEnd', src: '/sounds/complete.mp3' },
  { id: 'buttonClick', src: '/sounds/click.mp3' },
  { id: 'newHighScore', src: '/sounds/achievement.mp3' },
];

export function useSound() {
  // Audioオブジェクトのマップを保持するRef
  const audioMap = useRef<Map<string, HTMLAudioElement>>(new Map());
  // 音声が有効かどうかの状態
  const soundEnabled = useRef<boolean>(true);

  // コンポーネントがマウントされた時に効果音ファイルをプリロード
  useEffect(() => {
    // ローカルストレージから設定を取得
    const storedSoundEnabled = localStorage.getItem('soundEnabled');
    if (storedSoundEnabled !== null) {
      soundEnabled.current = storedSoundEnabled === 'true';
    }

    // 効果音のプリロード
    SOUND_FILES.forEach(file => {
      const audio = new Audio(file.src);
      audio.preload = 'auto';
      audioMap.current.set(file.id, audio);
    });

    return () => {
      // クリーンアップ
      audioMap.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioMap.current.clear();
    };
  }, []);

  // 効果音を再生する関数
  const play = useCallback((soundId: string) => {
    if (!soundEnabled.current) return;

    const audio = audioMap.current.get(soundId);
    if (audio) {
      // 再生中の場合はリセット
      audio.currentTime = 0;
      
      // iOSなどのモバイルデバイスでの再生のため、Promiseを使用
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('効果音の再生に失敗しました:', error);
        });
      }
    }
  }, []);

  // 効果音のオン/オフを切り替える関数
  const toggleSound = useCallback(() => {
    soundEnabled.current = !soundEnabled.current;
    localStorage.setItem('soundEnabled', String(soundEnabled.current));
    return soundEnabled.current;
  }, []);

  // 効果音が有効かどうかを取得する関数
  const isSoundEnabled = useCallback(() => {
    return soundEnabled.current;
  }, []);

  return {
    play,
    toggleSound,
    isSoundEnabled,
  };
} 