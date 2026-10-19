# collegeNavi

大学情報サービスのリポジトリです。

## 技術スタック

各パッケージの `package.json` と CI 設定に基づく構成です。
依存パッケージの正確な解決バージョンは、各ディレクトリの `pnpm-lock.yaml` で管理します。

| 分類 | 技術・ツール | 用途・対象 |
| --- | --- | --- |
| 言語 | TypeScript 6 / JavaScript（ES Modules） | API・Web・共有スキーマと設定ファイル |
| Web UI | React 19 / React DOM 19 | `web/` の UI とブラウザーへの描画 |
| Web ビルド・開発 | Vite 8 / `@vitejs/plugin-react` | 開発サーバー・React の開発支援・本番ビルド |
| スタイル | Tailwind CSS 4 / `@tailwindcss/vite` | `web/` のユーティリティクラスによるスタイリングと Vite 連携 |
| API フレームワーク | Hono 4 | `api/` のルーティングとリクエスト処理 |
| API 実行・デプロイ先 | Cloudflare Workers | API の実行環境 |
| Workers 開発 CLI | Wrangler 4 | ローカル開発・型生成・ビルド・デプロイ |
| API 検証 CLI | `@hono/cli` | ルート一覧とリクエストの検証 |
| 共有バリデーション | Zod 4 | `schemas/` の共有スキーマ定義・型推論 |
| 開発・CI ランタイム | Node.js 24 | pnpm と開発ツールの実行 |
| パッケージ管理 | pnpm 10.24.0 | ディレクトリごとの依存関係とロックファイルの管理 |
| 静的解析 | ESLint 10 / `@eslint/js` / `typescript-eslint` / `globals` | API・Web のコード検査と実行環境のグローバル変数定義 |
| React 向け静的解析 | `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` | `web/` の Hooks・React Refresh のルール |
| コード整形 | Prettier 3 / `eslint-config-prettier` | `api/` の整形と ESLint の競合ルール無効化 |
| 型定義 | `@types/node` / `@types/react` / `@types/react-dom` | `web/` の Node.js・React の型定義 |
| CI | GitHub Actions | 変更パスに応じた API・Web のチェック |
| CI アクション | `actions/checkout` / `pnpm/action-setup` / `actions/setup-node` | ソース取得・pnpm と Node.js のセットアップ・依存キャッシュ |
| AI 開発スキル | hono-skills / React Best Practices skills | API・Web の実装とレビューの指針 |

## 構成

| ディレクトリ | 内容 | CLI・開発手順 |
| --- | --- | --- |
| `api/` | Hono / Cloudflare Workers の API | [API README](api/README.md) |
| `web/` | React / TypeScript / Vite のフロントエンド | [Web README](web/README.md) |
| `schemas/` | Zod による共有スキーマ | [Schemas README](schemas/README.md) |

## 開発環境

CI に合わせて Node.js 24 と pnpm 10.24.0 を使用します。
各ディレクトリは独立した `package.json` とロックファイルを持ちます。

リポジトリ直下で依存関係をインストールします。

```sh
pnpm --dir schemas install --frozen-lockfile
pnpm --dir api install --frozen-lockfile
pnpm --dir web install --frozen-lockfile
```

API と Web は別々のターミナルで起動します。

```sh
pnpm --dir api dev
```

```sh
pnpm --dir web dev
```

## CI

GitHub Actions は push・Pull Request 時に変更パスを判定して実行します。
Actions 画面からの手動実行にも対応しています。

| ワークフロー | 変更対象 | チェック |
| --- | --- | --- |
| [Web CI](.github/workflows/web-ci.yml) | `web/**`・`schemas/**`・自身の YAML | ESLint・TypeScript 型チェック・Vite ビルド |
| [API CI](.github/workflows/api-ci.yml) | `api/**`・`schemas/**`・自身の YAML | ESLint・Prettier・Wrangler dry-run ビルド |

## AI 開発スキル

- `api/` の開発・レビューでは **hono-skills** を使用します。
- `web/` の開発・レビューでは **React Best Practices skills** を使用します。
