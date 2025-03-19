# 広告イレイザー - 開発ガイド

## プロジェクト構成

このプロジェクトは、Next.js（React + TypeScript）を使用して構築された「広告イレイザー」ゲームです。
プロジェクトの主な構成は以下の通りです。

```
/src
  /app - Next.jsのルーティングとレイアウト
  /components - Reactコンポーネント
    /game - ゲーム関連コンポーネント
    /ads - 広告関連コンポーネント
    /ui - 共通UIコンポーネント
  /hooks - カスタムフック
  /contexts - コンテキスト
  /services - サービス層
  /types - 型定義
  /utils - ユーティリティ関数
  /lib - ライブラリ統合
```

## 開発環境のセットアップ

### 必要条件
- Node.js 18.x以上
- npm 9.x以上

### インストール手順

1. リポジトリをクローン
```
git clone <repository-url>
```

2. プロジェクトディレクトリに移動
```
cd 広告イレイザー
```

3. 依存関係をインストール
```
npm install
```

4. 開発サーバーを起動
```
npm run dev
```

5. ブラウザで http://localhost:3000 にアクセス

## 主要コンポーネント

### ゲームフロー
- `src/app/page.tsx` - メインページ（ゲーム状態管理）
- `src/components/game/StartScreen.tsx` - スタート画面
- `src/components/game/GameScreen.tsx` - ゲームプレイ画面
- `src/components/game/ResultScreen.tsx` - 結果画面

### 広告関連
- `src/components/ads/Ad.tsx` - メイン広告（消す対象）コンポーネント
- `src/components/ads/CornerAd.tsx` - 背景広告コンポーネント

## 開発ワークフロー

### 新機能の追加

1. 新しいブランチを作成
```
git checkout -b feature/新機能名
```

2. コードを実装

3. テストを実行
```
npm run test
```

4. コードをフォーマット
```
npm run format
```

5. 変更をコミット
```
git commit -m "feat: 新機能の説明"
```

6. プルリクエストを作成

### 広告ネットワークとの連携（本番環境）

1. 各広告ネットワーク（ExoClick, PopAds, Adsterra）のアカウントを作成
2. サイト登録と広告ゾーンの作成
3. `src/services/ads` ディレクトリに連携コードを実装
4. 環境変数で広告タグIDや設定を管理

## デプロイガイド

### ビルド
```
npm run build
```

### 静的エクスポート（オプション）
```
npm run export
```

### デプロイ
- Vercel、Netlify、またはFirebase Hostingなどの静的ホスティングサービスを利用
- 環境変数の設定を忘れないこと

## パフォーマンス最適化のポイント

1. 広告表示のレンダリングを最適化（React.memo, useCallbackの活用）
2. 画像の最適化とプリロード
3. コンポーネントの遅延ロード
4. メモ化によるコンポーネント再描画の最小化

## 今後の拡張

1. 難易度レベルの実装
2. 特殊広告タイプの追加
3. アチーブメントシステム
4. ランキング機能の強化
5. SNS共有機能

---

詳細な仕様については、以下のドキュメントを参照してください：
- PROJECT_DOCUMENTATION.md - プロジェクト全体の計画
- GAME_DESIGN.md - ゲームデザインの詳細
- AD_INTEGRATION.md - 広告ネットワーク統合ガイド 