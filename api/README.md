# API

Hono と TypeScript で実装する Cloudflare Workers の API です。
コマンドは `api/` で実行します。

## セットアップ・起動

```sh
pnpm install --frozen-lockfile
pnpm cf-typegen
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
生成ファイル `worker-configuration.d.ts` は Git 管理対象外です。初回セットアップ時、Bindings・`compatibility_date`・互換性フラグの変更時、Wrangler 更新時に `pnpm cf-typegen` を実行してください。

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

API CI では `pnpm cf-typegen` で型を生成してから、`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm format:check`、Wrangler の dry-run ビルドを実行します。

## API の自動デプロイ

`.github/workflows/api-ci.yml` は、`main` への push（PR のマージを含む）時に、
CI の全チェックが成功した後で API を Cloudflare Workers にデプロイします。
対象の変更は `api/**`、`schemas/**`、このワークフローです。
PR・その他のブランチへの push・手動実行では検証のみ行います。
main の実行は新しい push でキャンセルせず、デプロイ途中の中断を避けます。

GitHub リポジトリの **Settings → Secrets and variables → Actions → Secrets** に、以下を登録してください。

| Secret                  | 内容                                            |
| ----------------------- | ----------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | 対象アカウントに限定したデプロイ用 API トークン |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイ先の Cloudflare アカウント ID           |

トークンは Cloudflare の「Edit Cloudflare Workers」テンプレートを基に作成し、
`wrangler.jsonc` の D1・R2・Vectorize・AI のバインディングに必要な権限も確認してください。
対象アカウントに設定済みの各リソースが必要です。
Secret が未設定の場合、デプロイは設定名を表示して失敗します。値はログに出しません。

デプロイ先・バインディングは `api/wrangler.jsonc`、コマンドは `pnpm run deploy` を使います。
Web のデプロイや D1 のマイグレーションはこのワークフローに含めません。

参照: [Cloudflare の GitHub Actions 設定](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)

## AI 開発スキル

このディレクトリの実装・修正・レビューでは **hono-skills** を使用します。
Hono のルーティング、ミドルウェア、バリデーションなどはスキルの指針に従い、
動作確認には Hono CLI を使用します。
