# Web

React・TypeScript・Vite・CSS で実装するフロントエンドです。
コマンドは `web/` で実行します。

## セットアップ・起動

```sh
pnpm install --frozen-lockfile
pnpm dev
```

エントリーポイントは `src/main.tsx`、アプリのコンポーネントは `src/App.tsx` です。

## CLI

| コマンド       | 用途                                                        |
| -------------- | ----------------------------------------------------------- |
| `pnpm dev`     | Vite の開発サーバーを起動                                   |
| `pnpm lint`    | ESLint で検査                                               |
| `pnpm build`   | TypeScript の型チェックと本番ビルドを実行し、`dist/` に出力 |
| `pnpm preview` | ビルド済みの `dist/` をローカルで確認                       |

ビルド結果を確認する場合は、次の順で実行します。

```sh
pnpm build
pnpm preview
```

## コード規約・CI

スタイリングは **CSS** を使用し、コンポーネントに対応する CSS ファイルで管理します。
共通のテーマ変数や全体の基本スタイルは `src/index.css` にまとめます。
画面の作成には `src/components` の共通 React コンポーネントを使用します。
共通部品のスタイルは `src/components/ui/ui.css` などにまとめています。

ESLint で TypeScript、React Hooks、React Refresh のルールを適用します。
Web CI では `pnpm lint` と `pnpm build` を実行します。

## AI 開発スキル

このディレクトリの実装・修正・レビューでは **React Best Practices skills** を使用します。
React コンポーネント、Hooks、データ取得、再レンダリングやバンドルサイズの改善では、
スキルの指針を確認して適用します。

## 学校担当者向けPages

Notion「フロント実装」に沿い、既存の共通コンポーネントで以下の画面を構成します。

| URL                       | ページ             |
| ------------------------- | ------------------ |
| `/school`                 | 学校担当者向けLP   |
| `/school/staff/register`  | 担当者情報の入力   |
| `/school/edit`            | 学校情報の編集     |
| `/school/listing/preview` | 掲載内容の確認     |
| `/school/payment`         | 掲載プラン・支払い |

`/` は `/school` に遷移します。LP以外にはStepperを表示します。
`src/pages/` は画面構成、`src/features/school/` は下書き管理・共通レイアウト・掲載表示、
`src/lib/` はブラウザー保存処理を担当します。フォーム検証は `/schemas/school_forms.ts` を共有します。

業務API・認証・決済の契約は未定義のため、今回は通信を行いません。
API連携時は `src/lib/` に共通通信処理を置き、機能別のAPI関数とSWR Hookを `src/features/` に追加します。
担当者入力を進めてもアカウントは登録されません。パスワードは画面内でのみ検証し、保存・送信しません。
学校情報は保存操作時にsessionStorageへ記録し、同じタブの再読み込みで復元します。
写真はメモリー内のみで保持し、再読み込み・タブ終了で失われます。
保存できない環境ではエラーを表示し、画面遷移中のメモリー内データは維持します。
公開・課金処理は行わず、支払いボタンは無効です。

`pnpm dev` で起動後、上記のURLを開いて確認してください。
本番配信時は各URLへの直接アクセスが `index.html` にフォールバックするSPA設定が必要です。

学校向けの登録・編集・確認・支払い画面は、Figma「ToB / B案・SmartHR UI参考」のB02〜B05を参照しています。
学校名・担当者氏名は担当者入力で受け取り、学校名は編集画面へ引き継ぎます。
イベント名と開催日は学校情報と同じ下書きに保存し、確認画面で表示します。
Excel読込・入力テンプレート・AI下書き生成・ログインは準備中です。
規約や料金が未確定のため、チェックボックスは入力内容の確認用で、正式な契約同意は取得しません。
