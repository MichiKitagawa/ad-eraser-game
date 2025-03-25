# 広告イレイザー

ユーザーが広告の×ボタンをタップしてスコアを稼ぐ、シンプルで中毒性のあるタップゲームです。

## ゲームの概要

- 30秒間のタイマー内で、できるだけ多くの広告をタップして消していきます
- 広告の×ボタンを正確にタップすると10点獲得
- 誤ってタップすると5秒の時間ペナルティ
- 連続成功でコンボボーナスが発生します

## 広告実装について

このゲームでは下記の2種類の広告を実装しています：

1. **ゲーム内模擬広告**: ゲームの中央に表示され、プレイヤーが×ボタンをタップして消す対象となる広告です。これは実際の広告ではなく、ゲームの一部として機能する模擬広告です。

2. **収益化広告**: 実際の広告ネットワーク（Adsterra）を使用した広告で、以下の2種類があります：
   - **コーナーバナー広告**: 画面の四隅に表示される小さなバナー広告（320x50サイズ）
   - **ポップアンダー広告**: ユーザーが広告の×ボタンをタップした際に裏側で開く広告

## セットアップ

### 環境変数

`.env.local`ファイルに以下の環境変数を設定してください：

```
# Supabase設定（ランキング機能用）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AdSterraの設定
NEXT_PUBLIC_ADSTERRA_SCRIPT_URL=your-adsterra-script-url
NEXT_PUBLIC_ADSTERRA_POPUNDER_URL=your-adsterra-popunder-url

# Matomoの設定（アナリティクス用）
NEXT_PUBLIC_MATOMO_URL=your-matomo-url
NEXT_PUBLIC_MATOMO_SITE_ID=your-matomo-site-id

# アプリケーションの設定
NEXT_PUBLIC_APP_URL=your-app-url
```

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルドと本番環境での起動
npm run build
npm start
```

## 開発モードと本番モード

- 開発モードでは、モックアップ広告が表示されます
- `src/services/ads/adService.ts`の`FORCE_REAL_ADS`フラグを`true`に設定すると、開発環境でも実際の広告が表示されます

## 広告テスト時の注意点

1. **ポップアップブロッカー**: ブラウザのポップアップブロッカーが有効になっていると、ポップアンダー広告が正常に表示されない場合があります。テスト時はポップアップブロックを無効にするか、サイトを許可リストに追加してください。

2. **開発環境での制限**: Chrome等のブラウザでは、開発環境（localhost）での`window.open()`の動作が制限されている場合があります。実際のドメインでテストすることをお勧めします。

3. **モバイル動作確認**: 特にモバイルデバイスでのテストは重要です。デスクトップとは広告の表示方法や制限が異なる場合があります。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 