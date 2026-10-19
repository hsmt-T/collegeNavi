# API

Hono と TypeScript で実装する Cloudflare Workers の API です。
コマンドは `api/` で実行します。

## セットアップ・起動

```sh
pnpm install --frozen-lockfile
pnpm dev
```

エントリーポイントは `src/index.ts`、Workers の設定は `wrangler.jsonc` です。

## CLI

| コマンド                                            | 用途                                                   |
| --------------------------------------------------- | ------------------------------------------------------ |
| `pnpm dev`                                          | Wrangler の開発サーバーを起動                          |
| `pnpm lint`                                         | ESLint で検査（警告もエラーとして扱う）                |
| `pnpm lint:fix`                                     | ESLint で自動修正                                      |
| `pnpm format`                                       | Prettier で整形                                        |
| `pnpm format:check`                                 | Prettier で整形をチェック                              |
| `pnpm cf-typegen`                                   | Workers の設定から `CloudflareBindings` などの型を生成 |
| `pnpm exec wrangler deploy --dry-run --outdir dist` | Worker をビルドして `dist/` に出力                     |
| `pnpm deploy`                                       | Cloudflare Workers にデプロイ                          |

デプロイには Cloudflare の認証と対象アカウントの権限が必要です。
Bindings を変更した場合は `pnpm cf-typegen` を実行し、生成された型を使用します。

```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Hono CLI

`@hono/cli` を開発依存として導入しています。
ルート確認やリクエスト検証に使用します。

```sh
pnpm exec hono --help
pnpm exec hono routes
pnpm exec hono request /
```

## コード規約・CI

ESLint の TypeScript 向け推奨ルールを使用します。
Prettier はシングルクォート・セミコロンなし・LF 改行で整形します。
生成物・ロックファイル・環境変数ファイルなどは整形対象から除外しています。

API CI では `pnpm lint`、`pnpm format:check`、Wrangler の dry-run ビルドを実行します。

## AI 開発スキル

このディレクトリの実装・修正・レビューでは **hono-skills** を使用します。
Hono のルーティング、ミドルウェア、バリデーションなどはスキルの指針に従い、
動作確認には Hono CLI を使用します。
