import { useState } from 'react'
import { Header } from '../navigation/Header'
import { Sidebar } from '../navigation/Sidebar'
import { createSchoolNavigation } from '../navigation/schoolNavigation'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { DescriptionRow } from '../ui/DescriptionRow'
import { FeatureRow } from '../ui/FeatureRow'
import { FileUpload } from '../ui/FileUpload'
import { FormField } from '../ui/FormField'
import { Icon } from '../ui/Icon'
import { Input, Textarea } from '../ui/Input'
import { StepItem } from '../ui/StepItem'
import { WorkflowPreview } from './WorkflowPreview'
import './preview.css'

export function ComponentPreview() {
  const [clicks, setClicks] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [activeItem, setActiveItem] = useState('schoolInformation')
  const [headerAction, setHeaderAction] = useState('未操作')
  const navigationItems = createSchoolNavigation({
    schoolInformation: '#school-information',
    preview: '#school-preview',
    payment: '#school-payment',
    accountSettings: '#account-settings',
  }).map((item) => ({
    ...item,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      setActiveItem(item.id)
    },
  }))
  return (
    <main className="preview">
      <h1>CollegeNavi — UI Components</h1>
      <p>Figmaの共通UIを個別に確認できます。</p>
      <WorkflowPreview />
      <section id="navigation-preview">
        <h2>共通ヘッダー</h2>
        <Header
          brandHref="#navigation-preview"
          helpLink={{
            href: '#help',
            onClick: (event) => {
              event.preventDefault()
              setHeaderAction('ヘルプ')
            },
          }}
          accountLink={{
            href: '#account',
            onClick: (event) => {
              event.preventDefault()
              setHeaderAction('学校担当者')
            },
          }}
        />
        <output aria-live="polite">ヘッダーの操作: {headerAction}</output>
      </section>
      <section>
        <h2>サイドメニュー</h2>
        <Sidebar
          schoolName="サンプル専門学校"
          items={navigationItems}
          activeItem={activeItem}
        />
        <output aria-live="polite">
          選択中:{' '}
          {navigationItems.find((item) => item.id === activeItem)?.label}
        </output>
      </section>
      <section>
        <h2>ボタン・必須ラベル</h2>
        <div className="preview__row">
          <Button onClick={() => setClicks((value) => value + 1)}>
            アカウントを登録する
          </Button>
          <Button variant="secondary">Excelから読み込む</Button>
          <Button showIcon={false}>操作する</Button>
          <Button disabled>操作する</Button>
          <Badge />
        </div>
        <output aria-live="polite">クリック回数: {clicks}</output>
      </section>
      <section className="preview__inputs">
        <h2>入力欄</h2>
        <Input aria-label="単一行入力" defaultValue="入力してください" />
        <Textarea aria-label="複数行入力" defaultValue="入力してください" />
      </section>
      <section className="preview__fields">
        <h2>フォーム項目</h2>
        <FormField
          label="項目名"
          required
          defaultValue="サンプル情報デザイン専門学校"
        />
        <FormField
          label="メールアドレス"
          name="email"
          type="email"
          required
          helperText="確認メールを受け取れるメールアドレスを入力してください。"
          defaultValue="school@example.ac.jp"
        />
        <FormField
          label="学校公式サイト"
          type="url"
          defaultValue="https://example.ac.jp"
        />
        <FormField
          label="学校紹介"
          multiline
          required
          defaultValue="実践授業とチーム制作を通じて、つくる力を育てます。"
        />
        <FormField
          label="学校の特色"
          multiline
          defaultValue="チーム制作、実践授業、就職サポート"
        />
        <FormField
          label="エラー表示"
          error="メールアドレスを入力してください。"
        />
      </section>
      <section>
        <h2>進捗・チェック</h2>
        <StepItem>ステップ</StepItem>
        <StepItem state="upcoming">ステップ</StepItem>
        <StepItem state="complete">ステップ</StepItem>
        <Checkbox
          label="利用規約・プライバシーポリシーに同意する"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        <output>同意: {agreed ? 'あり' : 'なし'}</output>
      </section>
      <section>
        <h2>ファイル選択</h2>
        <FileUpload accept="image/*" />
      </section>
      <section>
        <h2>通知・情報表示</h2>
        <Alert>
          プレビューです。以下の学校情報はデザイン確認用のサンプルです。
        </Alert>
        <dl>
          <DescriptionRow label="学校名">
            サンプル情報デザイン専門学校
          </DescriptionRow>
        </dl>
        <FeatureRow
          title="Excelでまとめて入力"
          description="学校案内などの情報をテンプレートに整理して読み込めます。"
        />
      </section>
      <section>
        <h2>アイコン</h2>
        <div className="preview__row">
          <Icon name="arrowForward" />
          <Icon name="upload" />
          <Icon name="upload" size={28} />
          <Icon name="radioChecked" />
          <Icon name="checkCircle" />
          <Icon name="image" />
          <Icon name="info" />
        </div>
      </section>
    </main>
  )
}
