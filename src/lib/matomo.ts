/**
 * Matomoの型定義
 */
interface MatomoWindow extends Window {
  _paq?: Array<any>;
}

declare const window: MatomoWindow;

/**
 * カスタムイベントを追跡
 */
export const trackEvent = (category: string, action: string, name?: string, value?: number): void => {
  if (typeof window !== 'undefined' && window._paq) {
    window._paq.push(['trackEvent', category, action, name, value]);
  }
};

/**
 * ゲーム開始イベントを追跡
 */
export const trackGameStart = (): void => {
  trackEvent('Game', 'Start');
};

/**
 * ゲーム終了イベントを追跡
 */
export const trackGameEnd = (score: number, duration: number): void => {
  trackEvent('Game', 'End', 'Score', score);
  trackEvent('Game', 'End', 'Duration', duration);
};

/**
 * 広告クリックイベントを追跡
 */
export const trackAdClick = (adType: string): void => {
  trackEvent('Ads', 'Click', adType);
};

/**
 * 広告表示イベントを追跡
 */
export const trackAdImpression = (adType: string): void => {
  trackEvent('Ads', 'Impression', adType);
};

/**
 * 誤タップイベントを追跡
 */
export const trackMissClick = (): void => {
  trackEvent('Game', 'MissClick');
};

/**
 * Matomoの初期化スクリプトをheadに追加する関数
 */
export const initMatomo = (): void => {
  if (typeof window !== 'undefined') {
    // すでに初期化されている場合は何もしない
    if (window._paq) {
      return;
    }

    // Matomo初期化コード
    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    
    const u = process.env.NEXT_PUBLIC_MATOMO_URL as string;
    const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID as string;
    
    window._paq.push(['setTrackerUrl', u + 'matomo.php']);
    window._paq.push(['setSiteId', siteId]);

    // スクリプトの挿入
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://cdn.matomo.cloud/${new URL(u).hostname}/matomo.js`;
    
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }
}; 