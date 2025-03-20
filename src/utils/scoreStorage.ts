/**
 * IndexedDBを使用したスコア管理ユーティリティ
 */

const DB_NAME = 'AdEraserGame';
const DB_VERSION = 1;
const STORE_NAME = 'scores';

// IndexedDBの初期化
export const initScoreDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // IndexedDBが使えない環境の場合はfalseを返す
    if (!window.indexedDB) {
      console.warn('このブラウザはIndexedDBをサポートしていません。スコアは保存されません。');
      resolve(false);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB接続エラー:', event);
      reject(false);
    };

    request.onsuccess = () => {
      resolve(true);
    };

    // データベースの構造定義（初回のみ実行）
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // スコア保存用のオブジェクトストア作成
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('score', 'score', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// スコアを保存
export const saveScore = (score: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('このブラウザはIndexedDBをサポートしていません。スコアは保存されません。');
      resolve(-1);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB接続エラー:', event);
      reject('接続エラー');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // 保存するデータ
      const scoreData = {
        score: score,
        date: new Date().toISOString()
      };

      const addRequest = store.add(scoreData);

      addRequest.onsuccess = (event) => {
        // 追加されたデータのID
        const resultId = (event.target as IDBRequest).result as number;
        resolve(resultId);
      };

      addRequest.onerror = () => {
        reject('保存エラー');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

// 最高スコアを取得
export const getHighScore = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('このブラウザはIndexedDBをサポートしていません。');
      resolve(0);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB接続エラー:', event);
      reject('接続エラー');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('score');

      // スコアの降順でソートして最高スコアを取得
      const cursorRequest = index.openCursor(null, 'prev');

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        
        if (cursor) {
          // 最初のレコード（最高スコア）を返す
          resolve(cursor.value.score);
        } else {
          // レコードがない場合は0を返す
          resolve(0);
        }
      };

      cursorRequest.onerror = () => {
        reject('取得エラー');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

// 最近のスコア履歴を取得
export const getRecentScores = (limit: number = 10): Promise<{ score: number; date: string }[]> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('このブラウザはIndexedDBをサポートしていません。');
      resolve([]);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB接続エラー:', event);
      reject('接続エラー');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('date');

      const scores: { score: number; date: string }[] = [];
      
      // 日付の降順でソート
      const cursorRequest = index.openCursor(null, 'prev');

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        
        if (cursor && scores.length < limit) {
          scores.push({
            score: cursor.value.score,
            date: cursor.value.date
          });
          cursor.continue();
        } else {
          resolve(scores);
        }
      };

      cursorRequest.onerror = () => {
        reject('取得エラー');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

// スコアデータをクリア
export const clearScores = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('このブラウザはIndexedDBをサポートしていません。');
      resolve(false);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB接続エラー:', event);
      reject('接続エラー');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        resolve(true);
      };

      clearRequest.onerror = () => {
        reject('クリアエラー');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}; 