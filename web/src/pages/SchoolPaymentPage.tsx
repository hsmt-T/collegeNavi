import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { schoolFormSchema } from '@collegenavi/schemas'
import { SchoolLayout } from '../features/school/SchoolLayout'
import { useSchoolDraft } from '../features/school/draft'
import { DescriptionRow } from '../components/ui/DescriptionRow'
import { Checkbox } from '../components/ui/Checkbox'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Icon } from '../components/ui/Icon'

export function SchoolPaymentPage() {
  const { school } = useSchoolDraft()
  const navigate = useNavigate()
  const [reviewed, setReviewed] = useState(false)
  const valid = schoolFormSchema.safeParse(school).success
  return (
    <SchoolLayout
      title="掲載手続き"
      intro="掲載プランと契約条件を確認し、お支払い手続きに進みます。"
      stage="payment"
    >
      {valid ? (
        <>
          <section className="panel form-stack workflow-application">
            <h2>お申し込み内容</h2>
            <div className="workflow-divider" />
            <dl>
              <DescriptionRow label="学校名">{school.name}</DescriptionRow>
              <DescriptionRow label="掲載内容">
                学校情報・学校紹介・オープンキャンパス情報
              </DescriptionRow>
              <DescriptionRow label="掲載プラン">
                学校情報掲載プラン（準備中）
              </DescriptionRow>
              <DescriptionRow label="料金・課金周期">未定</DescriptionRow>
              <DescriptionRow label="自動更新・解約条件">未定</DescriptionRow>
            </dl>
          </section>
          <Alert>
            料金・契約条件は検討中です。確定後、この画面に表示します。
          </Alert>
          <section className="panel form-stack">
            <h2 className="workflow-icon-heading">
              <Icon name="payment" />
              お支払い
            </h2>
            <p>
              お支払い機能は準備中です。現在、お支払いや掲載申し込みはできません。
            </p>
            <Checkbox
              label="掲載内容を確認しました"
              checked={reviewed}
              onChange={(event) => setReviewed(event.target.checked)}
            />
            <p className="workflow-note">
              料金・自動更新・解約条件、利用規約の確認・同意は正式な申込時にご案内します。
            </p>
          </section>
          <div className="page-actions">
            <Button
              variant="secondary"
              showIcon={false}
              onClick={() => navigate('/school/listing/preview')}
            >
              表示確認に戻る
            </Button>
            <Button disabled aria-describedby="payment-help">
              お支払いへ進む
            </Button>
          </div>
          <p id="payment-help" className="workflow-note">
            ※ 準備中の画面です。実際の決済・掲載は実行されません。
          </p>
        </>
      ) : (
        <section className="panel">
          <h2>先に学校情報を入力してください</h2>
          <Link to="/school/edit">学校情報の入力へ</Link>
        </section>
      )}
    </SchoolLayout>
  )
}
