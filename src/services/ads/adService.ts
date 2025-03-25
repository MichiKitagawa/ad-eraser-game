import { trackAdImpression, trackAdClick } from '@/lib/matomo';

// 広告設定
const ADSTERRA_SCRIPT_URL = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL as string;
const ADSTERRA_POPUNDER_URL = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_URL || 'https://www.adsterra.com'; // ポップアンダー広告のURL

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

    if (!ADSTERRA_SCRIPT_URL) {
      console.error('AdSterraスクリプトURLが設定されていません');
      return;
    }

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = ADSTERRA_SCRIPT_URL;
      script.async = true;
      
      document.head.appendChild(script);
      console.log('AdSterraスクリプトを読み込みました:', ADSTERRA_SCRIPT_URL);
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
  
  try {
    // ユーザーのクリックイベント内で直接window.openを実行
    // 非同期処理や遅延を入れずに実行する
    const popWindow = window.open(ADSTERRA_POPUNDER_URL, '_blank');
    
    // ポップアップブロックのチェック
    if (!popWindow || popWindow.closed || typeof popWindow.closed === 'undefined') {
      console.warn('ポップアップがブロックされている可能性があります');
    } else {
      console.log('ポップアンダー広告を表示しました');
    }
    
    trackAdImpression('popunder');
  } catch (error) {
    console.error('ポップアンダー広告の表示に失敗しました:', error);
  }
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

  // 開発環境またはフォールバックとしてモック広告を表示（FORCE_REAL_ADSがtrueの場合はスキップ）
  if (isDevelopment() || (!ADSTERRA_SCRIPT_URL && !FORCE_REAL_ADS)) {
    container.innerHTML = `
      <div class="bg-gray-200 text-center p-2 text-xs w-full h-full flex items-center justify-center">
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

  // 本番環境では実際の広告コードを挿入（document.writeは使用しない）
  try {
    // ゾーンIDを取得する関数を定義
    const getZoneIdForPosition = (id: string) => {
      switch(id) {
        case 'corner-ad-top-left': return 5128390;
        case 'corner-ad-top-right': return 5128391;
        case 'corner-ad-bottom-left': return 5128392;
        case 'corner-ad-bottom-right': return 5128393;
        default: return 5128390; // デフォルト
      }
    };
    
    // コンテナをクリアして新しい広告用divを準備
    container.innerHTML = '';
    
    // 広告用のdiv要素を作成
    const adDiv = document.createElement('div');
    adDiv.id = `adsterra-${containerId}`;
    adDiv.className = 'w-full h-full';
    
    // スクリプト要素を動的に作成
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // ゾーンIDを取得
    const zoneId = getZoneIdForPosition(containerId);
    
    // スクリプトのソースを設定
    script.src = `//pl26155830.effectiveratecpm.com/aebc06e0965f1f4e34239dbc99e94542?&width=300&height=250&zoneId=${zoneId}`;
    script.async = true;
    
    // 要素を追加
    adDiv.appendChild(script);
    container.appendChild(adDiv);
    
    console.log(`本番広告を表示しました: ${containerId}, zoneId: ${zoneId}`);
    trackAdImpression('banner');
  } catch (error) {
    console.error('広告挿入中にエラーが発生しました:', error);
    // エラー時のフォールバック
    container.innerHTML = `
      <div class="bg-red-100 text-center p-2 text-xs w-full h-full flex items-center justify-center">
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