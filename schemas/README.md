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

## クライアント認証APIの契約（仕様案）

`client_auth.ts` に登録・ログインのリクエスト、レスポンス、共通エラーと推論型を定義します。
登録入力は `schoolStaffFormSchema` と共通で、ログイン入力はメールアドレスとパスワードです。
`publicClientSchema` は `id`・`name`・`email` のみを明示し、`password_hash` を公開しません。
成功応答は `{ client: ... }`、エラー応答は `{ error: { code, message } }` です。
パスワードはハッシュ化前の入力に8文字以上・30文字以下を要求します。登録・ログイン・担当者フォームで共通です。
入力はトリム・切り詰めしません。セッション方式は未確定で、APIは入力検証後に501を返します。
API固有のパス・ステータスコード・OpenAPIの例はAPIのpresentationで管理します。

## テーブルスキーマ

参照元：[Notion DB設計](https://app.notion.com/p/405dfe8ca82180c8891afcd0717c7708)（2026-11-19更新）。
ToB（学校側）で必要な7テーブル・42カラムの保存済みレコードを、テーブル名と同名のファイルで定義します。
カラム名はDB定義どおりの snake_case を使用します。

```ts
import { collegeSchema, type College } from '@collegenavi/schemas'

const college: College = collegeSchema.parse(record)
```

| ファイル               | スキーマ                | 型                |
| ---------------------- | ----------------------- | ----------------- |
| colleges.ts            | collegeSchema           | College           |
| college_keywords.ts    | collegeKeywordSchema    | CollegeKeyword    |
| clients.ts             | clientSchema            | Client            |
| client_colleges.ts     | clientCollegeSchema     | ClientCollege     |
| events.ts              | eventSchema             | Event             |
| imgs.ts                | imgSchema               | Img               |
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

## 学校向け入力フォーム

`school_forms.ts` では保存済みレコードとは別に、入力用の `schoolFormSchema`・
`schoolStaffFormSchema` と `SchoolForm` 型を公開します。
学校フォームはサーバー管理のID・公開状態・検索更新版を受け取らず、
学校名・所在地・分野・都道府県の必須チェック、HTTP(S)の公式URL、最大3件のキーワードの空白除去・重複チェックを行います。
未入力の公式URLは空文字列を許可します。これらの必須条件は掲載準備用フォームの暫定条件です。
担当者フォームはメール形式・パスワード8〜30文字・確認値一致を検証します。
認証方式や文字数以外のパスワード条件を確定した場合は、APIと合わせて更新してください。

担当者登録時には学校名を入力しません。学校名は後続の学校情報入力画面で `schoolFormSchema.name` として受け取ります。
`staff_name` はAPIの本処理実装時に `clients.name` へ保存する担当者氏名です。
現在のWebは掲載準備用で、APIへの送信・DB保存は未実装です。
`clients` は `college_id` を保持せず、学校未登録でも担当者を作成できます。
所属は `client_colleges(client_id, college_id)` に保存し、組み合わせを複合主キーとします。
担当者とキャンパスは多対多で、認可時は認証済み担当者と対象キャンパスの所属をサーバーで確認します。
学校フォームの `event_title`・`event_date` は任意のイベント下書きで、片方のみの入力は拒否します。
既存下書きとの互換性のため未指定時は空文字列を補います。DBの日時列や必須条件を確定するものではありません。
