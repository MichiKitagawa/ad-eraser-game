import { trackAdImpression, trackAdClick } from '@/lib/matomo';

// 広告設定
const ADSTERRA_SCRIPT_URL = '//pl26210797.effectiveratecpm.com/20/3c/f6/203cf6d532ca4a4c4fceb543ffc78393.js';
const BANNER_SCRIPT_URL = '//www.highperformanceformat.com/8ff02e8938cdf5e94c9fa90dffd2b194/invoke.js';

// 強制的に広告を表示するフラグ (開発環境でも広告表示をテスト可能に)
const FORCE_REAL_ADS = true;

/**
 * 現在の環境が開発環境かどうかを判定
 * FORCE_REAL_ADSがtrueの場合は常に本番環境として扱う
 */
const isDevelopment = (): boolean => {
  return !FORCE_REAL_ADS && process.env.NODE_ENV === 'development';
};

/**
 * AdSterraの広告スクリプトを読み込む
 */
export const loadAdSterraScript = (): void => {
  if (typeof window !== 'undefined') {
    // すでに読み込み済みの場合は何もしない
    if (document.querySelector(`script[src*="${ADSTERRA_SCRIPT_URL}"]`)) {
      console.log('AdSterraスクリプトはすでに読み込まれています');
      return;
    }

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = ADSTERRA_SCRIPT_URL;
      script.async = true;
      
      document.head.appendChild(script);
      console.log('AdSterraスクリプトを読み込みました');
    } catch (error) {
      console.error('AdSterraスクリプト読み込み中にエラーが発生しました:', error);
    }
  }
};

/**
 * ポップアンダー広告を表示する
 * ユーザーアクション（クリック）時に直接呼び出すこと
 */
export const showPopunder = (): void => {
  // 開発環境では実行しない（ただしFORCE_REAL_ADSがtrueの場合は実行）
  if (isDevelopment()) {
    console.log('[開発環境] ポップアンダー広告をシミュレート');
    trackAdImpression('popunder');
    return;
  }

  console.log('ポップアンダー広告表示を試行');
  trackAdImpression('popunder');
};

/**
 * バナー広告をDOMに挿入する
 */
export const insertBannerAd = (containerId: string): void => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`広告コンテナが見つかりません: ${containerId}`);
    return;
  }

  console.log(`広告を挿入します: ${containerId}, 環境: ${isDevelopment() ? '開発' : '本番'}`);

  // 開発環境またはフォールバックとしてモック広告を表示
  if (isDevelopment() || (!BANNER_SCRIPT_URL && !FORCE_REAL_ADS)) {
    container.innerHTML = `
      <div class="bg-gray-200 text-center p-2 text-xs w-[300px] h-[250px] flex items-center justify-center">
        <div>
          <div class="font-bold">広告</div>
          <div>(開発環境)</div>
        </div>
      </div>
    `;
    console.log(`モック広告を表示しました: ${containerId}`);
    trackAdImpression('banner');
    return;
  }

  // 本番環境では実際の広告コードを挿入
  try {
    // コンテナをクリアして新しい広告用divを準備
    container.innerHTML = '';
    
    // atOptionsの設定
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.text = `
      atOptions = {
        'key' : '8ff02e8938cdf5e94c9fa90dffd2b194',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    container.appendChild(atOptionsScript);
    
    // 広告スクリプトを挿入
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = BANNER_SCRIPT_URL;
    adScript.async = true;
    
    container.appendChild(adScript);
    console.log(`本番広告を表示しました: ${containerId}`);
    trackAdImpression('banner');
  } catch (error) {
    console.error('広告挿入中にエラーが発生しました:', error);
    // エラー時のフォールバック
    container.innerHTML = `
      <div class="bg-red-100 text-center p-2 text-xs w-[300px] h-[250px] flex items-center justify-center">
        <div>
          <div class="font-bold">広告</div>
          <div>(エラー)</div>
        </div>
      </div>
    `;
  }
};

/**
 * モバイルかどうかを検出
 */
export const isMobile = (): boolean => {
  if (typeof window !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};

/**
 * 広告設定を環境に応じて取得
 */
export const getAdConfig = () => {
  // 開発環境用の設定（ただしFORCE_REAL_ADSがtrueの場合は本番設定を使用）
  if (isDevelopment() && !FORCE_REAL_ADS) {
    return {
      popunderInterval: 5000, // 5秒間隔（より頻繁に表示）
      bannerRefreshInterval: 10000, // 10秒間隔
      enableRealAds: false,
    };
  }

  // 本番環境用の設定
  return {
    popunderInterval: 5000, // 5秒間隔（より頻繁に表示）
    bannerRefreshInterval: 5000, // 5秒間隔（本番ではより短く）
    enableRealAds: true,
  };
}; 