import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { schoolFormSchema } from '@collegenavi/schemas'
import { SchoolLayout } from '../features/school/SchoolLayout'
import { SchoolListing } from '../features/school/SchoolListing'
import { useSchoolDraft } from '../features/school/draft'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { Icon } from '../components/ui/Icon'

const checks = [
  '学校名・所在地',
  '紹介文・学校の特色',
  '写真の内容',
  'イベント名・開催日',
]
export function SchoolListingPreviewPage() {
  const { school } = useSchoolDraft()
  const navigate = useNavigate()
  const [reviewed, setReviewed] = useState<string[]>([])
  const valid = schoolFormSchema.safeParse(school).success
  return (
    <SchoolLayout
      title="掲載内容の確認"
      intro="高校生に表示される内容を確認してください。"
      stage="preview"
    >
      <Alert>
        プレビューです。以下は入力した下書きの内容で、まだ公開されていません。
      </Alert>
      {valid ? (
        <>
          <div className="workflow-columns">
            <SchoolListing />
            <aside className="panel form-stack workflow-guide">
              <h2>公開前の確認</h2>
              {checks.map((label) => (
                <Checkbox
                  key={label}
                  label={label}
                  checked={reviewed.includes(label)}
                  onChange={(event) =>
                    setReviewed((current) =>
                      event.target.checked
                        ? [...current, label]
                        : current.filter((value) => value !== label),
                    )
                  }
                />
              ))}
              <div className="workflow-divider" />
              <Button
                variant="secondary"
                icon={<Icon name="edit" />}
                onClick={() => navigate('/school/edit')}
              >
                学校情報を修正
              </Button>
            </aside>
          </div>
          <div className="page-actions">
            <Button
              variant="secondary"
              showIcon={false}
              onClick={() => navigate('/school/edit')}
            >
              編集に戻る
            </Button>
            <Button onClick={() => navigate('/school/payment')}>
              掲載手続きへ
            </Button>
          </div>
        </>
      ) : (
        <section className="panel">
          <h2>学校情報を入力してください</h2>
          <p>
            確認できる学校情報がまだありません。必須項目を入力してから、掲載内容を確認できます。
          </p>
          <Link to="/school/edit">学校情報の入力へ</Link>
        </section>
      )}
    </SchoolLayout>
  )
}
