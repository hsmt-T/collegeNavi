# Schemas

Zod による共有スキーマを管理する TypeScript パッケージです。
パッケージ名は `@collegenavi/schemas` です。

## CLI

コマンドは `schemas/` で実行します。

```sh
pnpm install --frozen-lockfile
```

依存関係の追加・更新後にロックファイルを更新する場合は `pnpm install` を使用します。

## 構成・利用方針

- `index.ts` をエントリーポイントとして TypeScript ソースを直接参照します。
- 現在は `index.ts` から Zod の `z` を再エクスポートしています。
- 共通スキーマや推論型はこのディレクトリで定義し、`index.ts` から公開します。
- `api`・`web` から利用する際は、利用側に依存関係やインポートを追加します。
- `private: true` を設定しており、npm への公開と単体ビルドは行いません。

`schemas/**` の変更時は API CI と Web CI の両方が実行されます。
