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
- `index.ts` からテーブルごとのスキーマと `z.infer` による型を公開します。
- 共通スキーマや推論型はこのディレクトリで定義し、`index.ts` から公開します。
- `api`・`web` から利用する際は、利用側に依存関係やインポートを追加します。
- `private: true` を設定しており、npm への公開と単体ビルドは行いません。

`schemas/**` の変更時は API CI と Web CI の両方が実行されます。

## テーブルスキーマ

参照元：[Notion DB設計](https://app.notion.com/p/405dfe8ca82180c8891afcd0717c7708)（2026-11-12確認）。
ToB（学校側）で必要な6テーブル・40カラムの保存済みレコードを、テーブル名と同名のファイルで定義します。
カラム名はDB定義どおりの snake_case を使用します。

```ts
import { collegeSchema, type College } from '@collegenavi/schemas'

const college: College = collegeSchema.parse(record)
```

| ファイル | スキーマ | 型 |
| --- | --- | --- |
| colleges.ts | collegeSchema | College |
| college_keywords.ts | collegeKeywordSchema | CollegeKeyword |
| clients.ts | clientSchema | Client |
| events.ts | eventSchema | Event |
| imgs.ts | imgSchema | Img |
| college_search_sync.ts | collegeSearchSyncSchema | CollegeSearchSync |

INTEGERは整数、TEXTは文字列として検証します。全カラムを必須とし、
`imgs.event_id` と同期管理の `indexed_revision`・`content_hash`・`mutation_id`・`last_error` はNULLを許可します。
同期状態は `pending`・`submitted`・`ready`・`failed`・`deleting` に限定します。

設計中のNULL可否はNotionの現時点の登録に合わせた暫定定義です。
未確定の公開状態・日時形式・文字数・ID採番・初期値には追加制約やデフォルト値を設けません。
`attempt_count` のDB初期値0も、保存済みレコードの検証では補完しません。
共通カラムとして省略されている `created_at` は含めません。ToC（学生側）の5テーブルは今後の実装対象です。

これらは行単位の検証です。外部キー・UNIQUE・複合主キー・画像とイベントの所属一致、
キャンパスごとのキーワード最大3件など、複数行にまたがる制約はDB・APIで保証する必要があります。
認証用テーブルの型には `password_hash` が含まれるため、公開レスポンスにはそのまま使用しないでください。
