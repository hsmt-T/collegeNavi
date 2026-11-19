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

## API ドキュメント

`pnpm dev` で起動後、以下のURLを開きます。本番でも同じパスで公開されます。

| パス            | 内容                                                      |
| --------------- | --------------------------------------------------------- |
| `/docs`         | Swagger UI。API仕様の閲覧とTry it outによるリクエスト実行 |
| `/openapi.json` | OpenAPI 3.1のJSON定義                                     |

既存の `GET /health/db` は通常のHonoルートのままとし、OpenAPI定義には含めません。
クライアント登録・ログインの仕様案を登録しています。本処理は未実装です。
Swagger UIは同じオリジンのAPIへリクエストします。UIのJS・CSSは外部CDNから読み込みます。

APIの追加時は `@hono/zod-openapi` の `createRoute` と `app.openapi` でルートを登録し、
入力・応答スキーマは `/schemas` のZod 4スキーマを共有してください。
ルート定義からOpenAPIを生成するため、別のJSON仕様を手作業で管理する必要はありません。

### クライアント登録・ログイン（仕様確認段階）

`pnpm dev` で起動し、`http://localhost:8787/docs` の「クライアント認証」を開きます。
リクエスト例、成功応答例、エラー応答例を確認し、Try it out で入力検証を実行できます。

| メソッド・パス           | 入力                                                       | 将来の成功応答               |
| ------------------------ | ---------------------------------------------------------- | ---------------------------- |
| `POST /clients/register` | `staff_name`, `email`, `password`, `password_confirmation` | `201` と公開クライアント情報 |
| `POST /clients/login`    | `email`, `password`                                        | `200` と公開クライアント情報 |

現段階では、有効な入力は `501 NOT_IMPLEMENTED`、入力不正や不正なJSONは `400 INVALID_REQUEST` を返します。
成功応答、登録済みメールの `409`、認証失敗の `401` は仕様例で、まだ発生しません。
DBの読み書き、パスワードの保存・照合、セッション発行、Web画面の接続は行いません。
応答に `password_hash`・パスワードを含めず、エラーにも入力値を含めません。

登録入力は担当者フォームと共通で、学校名は受け取りません。
学校名は後続の学校情報入力画面で入力します。
`staff_name` は本処理実装時に `clients.name` へ保存します。
`clients` には `college_id` を持たせず、学校未登録でも担当者を作成できます。
所属は `client_colleges(client_id, college_id)` で管理し、同じ組を複合主キーで一意にします。
学校の管理権限は認証済み担当者と対象キャンパスの所属で判定します。
登録・ログインの公開クライアント情報は `id`・`name`・`email` です。
パスワードは共有Zodで8文字以上・30文字以下を検証します。登録・ログイン・担当者フォームに共通し、
ハッシュ化前の入力を対象にします。入力のトリムや切り詰めは行いません。
学校登録・所属追加の権限・手順とトランザクション、メールの正規化・重複判定、
セッション方式・期限・ログアウト・試行回数制限は、本処理の実装前に確定します。

クリーンアーキテクチャの方針で、HTTPとOpenAPIの定義は
`src/presentation/routes/client-auth.ts` に置きます。今回は仕様確認に必要なpresentationのみを追加し、
今後、業務処理をapplication/domain、D1・R2の実装をinfrastructureに追加します。
共有ZodスキーマはHTTPの入出力契約として扱い、domainからHTTPやCloudflareに依存させません。

進め方は、共有Zodとルート定義 → Swagger UIで仕様確認 → ユースケース → 永続化・認証処理です。
[Hono公式のZod OpenAPI例](https://hono.dev/examples/zod-openapi)に沿って仕様を生成します。

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
