# CollegeNavi UI Components

`web/AGENTS.md` のFigmaファイルの「UI Components」ページを参照しています。
画面への組み込みは行わず、共通部品を `ui/` と `navigation/` に配置しています。

## 確認

```sh
cd web
pnpm install --frozen-lockfile
pnpm dev
```

`http://localhost:5173/components.html` で部品と各状態を確認できます。
この一覧は開発時の確認用です。通常のアプリのエントリーは変更していません。

## 対応するFigmaコンポーネント

| Figma              | 実装                                                                      | node-id |
| ------------------ | ------------------------------------------------------------------------- | ------- |
| UI/Badge           | `ui/Badge.tsx`                                                            | 43:4    |
| UI/Button          | `ui/Button.tsx`（primary / secondary、アイコンの差し替え・非表示）        | 47:675  |
| UI/Input           | `ui/Input.tsx`（Input / Textarea）                                        | 47:676  |
| UI/FormField       | `ui/FormField.tsx`（必須・任意、補足文、単一行・複数行）                  | 47:677  |
| UI/Checkbox        | `ui/Checkbox.tsx`                                                         | 44:147  |
| UI/StepItem        | `ui/StepItem.tsx`（current / upcoming / complete）                        | 47:679  |
| UI/FileUpload      | `ui/FileUpload.tsx`                                                       | 44:249  |
| UI/Alert           | `ui/Alert.tsx`                                                            | 44:291  |
| UI/FeatureRow      | `ui/FeatureRow.tsx`                                                       | 44:61   |
| UI/DescriptionRow  | `ui/DescriptionRow.tsx`                                                   | 44:342  |
| UI/NavItem         | `ui/NavItem.tsx`（選択中 / 未選択）                                       | 47:678  |
| Navigation/Header  | `navigation/Header.tsx`                                                   | 45:1349 |
| Navigation/Sidebar | `navigation/Sidebar.tsx`（学校情報 / 内容確認 / 支払い）                  | 47:681  |
| Navigation/Stepper | `navigation/Stepper.tsx`（担当者登録 / 学校情報 / 表示確認 / 掲載手続き） | 47:680  |

色・文字・余白は `ui/ui.css` に集約しています。Noto Sans JP（400 / 700）と
Material IconsはFontsourceからローカル配信します。外部フォントCDNは不要です。
Iconは取得できた部品で使用するグリフを提供します。

## 使用例

```tsx
import { Button } from './components/ui/Button'
import { FormField } from './components/ui/FormField'

<FormField
  label="メールアドレス"
  name="email"
  type="email"
  required
  helperText="確認メールを受け取れるメールアドレスを入力してください。"
/>
<Button type="submit">アカウントを登録する</Button>
```

Input / Textarea / Checkboxは標準のHTML属性とイベント、refを受け取ります。
FormFieldはラベル・補足文・エラーを入力欄に関連付け、自動IDも生成します。
`error` は呼び出し元の検証結果を渡すための表示用です。
業務バリデーションを追加するときは `/schemas` のZod 4スキーマを共有してください。
FileUploadは選択したファイル名を表示し、`onChange` でFileListを受け取れます。
サーバーへの送信処理は呼び出し元で実装します。
DescriptionRowは `dl` の子として使用してください。

## 共通ヘッダーとサイドメニュー

Figmaから取得した仕様を基に、濃色ヘッダー・224px幅のサイドメニューを実装しています。
ヘッダーのスペーサーは可変幅にし、狭い画面ではリンクを折り返します。
学校名やアカウント名が長い場合も、情報を省略せず折り返して表示します。

```tsx
import { Header } from './components/navigation/Header'
import { Sidebar } from './components/navigation/Sidebar'
import { createSchoolNavigation } from './components/navigation/schoolNavigation'

// URLは実際のルーティングに合わせて指定してください。
const items = createSchoolNavigation({
  schoolInformation: '/school/edit',
  preview: '/school/preview',
  payment: '/school/payment',
  accountSettings: '/account/settings',
})

<Header
  helpLink={{ href: '/help' }}
  accountLink={{ href: '/account/settings', label: '学校担当者' }}
/>
<Sidebar
  schoolName="サンプル専門学校"
  status="掲載準備中"
  items={items}
  activeItem="schoolInformation"
/>
```

`items` は任意の項目に差し替えられ、`onClick` も指定できます。
`activeItem` に一致する項目に `aria-current="page"` と選択色を付けます。
ルーティングや選択状態の更新は呼び出し元で管理してください。
ヘッダーのブランド名・アイコン・機能名・各リンクの文言や属性も指定できます。
確認用一覧ではリンクの画面遷移を抑え、クリックとキーボード操作で表示を更新します。

## 登録・保存・確認の共通UI

`/components.html` の先頭で、追加した5種類の状態と操作を確認できます。
StepperはFigmaの仕様を参照し、残りの部品は既存の色・文字・ボタンに合わせて追加しています。

| 部品                     | 主なprops                                                | 動作                                                                                                                |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `navigation/Stepper.tsx` | `stage`                                                  | `registration` / `schoolInformation` / `preview` / `payment` の現在位置と完了済みの段階を表示。狭い画面では縦並び   |
| `ui/SaveNotice.tsx`      | `state`, `message`, `onRetry`                            | `unsaved` / `saving` / `saved` / `error` を表示。失敗時は任意の再試行操作を提供                                     |
| `ui/ConfirmDialog.tsx`   | `open`, `onOpenChange`, `title`, `onConfirm`, `children` | モーダル確認、Esc・キャンセル、フォーカスの復帰。非同期処理中の二重実行を防止し、失敗時はダイアログ内にエラーを表示 |
| `ui/ErrorSummary.tsx`    | `errors: { fieldId, message }[]`                         | エラー一覧から入力要素へフォーカス移動。0件なら表示しない                                                           |
| `ui/ImagePreview.tsx`    | `initialImage`, `maxSizeBytes`, `onFileChange`           | 画像の選択・差し替え・削除。JPEG / PNG / WebP、初期上限5MB。表示エラーと形式・容量エラーを表示                      |

```tsx
import { Stepper } from './components/navigation/Stepper'
import { SaveNotice } from './components/ui/SaveNotice'
import { ErrorSummary } from './components/ui/ErrorSummary'
import { ImagePreview } from './components/ui/ImagePreview'

<Stepper stage="schoolInformation" />
<SaveNotice state="saved" />
<ErrorSummary errors={[{ fieldId: 'school-name', message: '学校名を入力してください。' }]} />
<FormField id="school-name" label="学校名" />
<ImagePreview onFileChange={file => { /* 選択・削除をフォームの状態へ反映 */ }} />
```

ConfirmDialogは `onConfirm` の完了後に `onOpenChange(false)` を呼びます。
Promiseが失敗した場合は閉じず、再試行できます。処理中はキャンセルとEscを無効にします。
保存結果やフォーム検証結果は呼び出し元から渡してください。通知は自動で消去しません。
ErrorSummaryの `fieldId` は、対応するInput / FormFieldの `id` と一致させます。
業務バリデーションは引き続き `/schemas` のZod 4で共有してください。

ImagePreviewの `onFileChange` は選択時にFile、削除時にnullを返します。
`initialImage={{ src, alt }}` で登録済み画像を表示できます。
別レコードへ切り替える場合は `key` を変えて選択状態を初期化してください。
ローカルプレビュー用のBlob URLは差し替え・削除・アンマウント時に解放します。
ファイル選択とプレビューはクライアント側のみです。保存・画像送信処理は含みません。
画像の形式・容量のチェックは操作支援用で、サーバー側でも検証してください。

## 未取得の部品

Figma MCPのStarterプランの呼び出し上限により、以下は詳細仕様を取得できていません。
実装にはデザインコンテキストの再取得が必要です。

- UI/TextButton、UI/ImagePlaceholder
- Sections配下の11コンポーネント
- 上記の部品で使う残りのIcons
