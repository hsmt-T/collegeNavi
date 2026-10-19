# Web

React・TypeScript・Vite・Tailwind CSS で実装するフロントエンドです。
コマンドは `web/` で実行します。

## セットアップ・起動

```sh
pnpm install --frozen-lockfile
pnpm dev
```

エントリーポイントは `src/main.tsx`、アプリのコンポーネントは `src/App.tsx` です。

## CLI

| コマンド | 用途 |
| --- | --- |
| `pnpm dev` | Vite の開発サーバーを起動 |
| `pnpm lint` | ESLint で検査 |
| `pnpm build` | TypeScript の型チェックと本番ビルドを実行し、`dist/` に出力 |
| `pnpm preview` | ビルド済みの `dist/` をローカルで確認 |

ビルド結果を確認する場合は、次の順で実行します。

```sh
pnpm build
pnpm preview
```

## コード規約・CI

スタイリングは **Tailwind CSS** のユーティリティクラスを基本とし、
React コンポーネントの `className` に記述します。
Vite プラグイン `@tailwindcss/vite` を使用し、`src/index.css` で Tailwind を読み込みます。
共通のテーマ変数や全体の基本スタイルは `src/index.css` にまとめます。
既存テンプレートの CSS は、コンポーネントの変更に合わせて Tailwind に移行します。

ESLint で TypeScript、React Hooks、React Refresh のルールを適用します。
Web CI では `pnpm lint` と `pnpm build` を実行します。

## AI 開発スキル

このディレクトリの実装・修正・レビューでは **React Best Practices skills** を使用します。
React コンポーネント、Hooks、データ取得、再レンダリングやバンドルサイズの改善では、
スキルの指針を確認して適用します。
