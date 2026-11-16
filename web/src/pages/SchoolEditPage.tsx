import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { schoolFormSchema } from '@collegenavi/schemas'
import type { SchoolForm } from '@collegenavi/schemas'
import { SchoolLayout } from '../features/school/SchoolLayout'
import { useSchoolDraft } from '../features/school/draft'
import { prefectures } from '../features/school/prefectures'
import { FormField } from '../components/ui/FormField'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ErrorSummary } from '../components/ui/ErrorSummary'
import { ImagePreview } from '../components/ui/ImagePreview'
import { SaveNotice } from '../components/ui/SaveNotice'
import { Icon } from '../components/ui/Icon'

export function SchoolEditPage() {
  const { school, saveSchool, setImage, imageUrl, registration } =
    useSchoolDraft()
  const navigate = useNavigate()
  const [values, setValues] = useState<SchoolForm>({
    ...school,
    name: school.name || registration.school_name,
  })
  const [keywords, setKeywords] = useState(() =>
    Array.from({ length: 3 }, (_, i) => school.keywords[i] ?? ''),
  )
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>(
    [],
  )
  const [notice, setNotice] = useState<'unsaved' | 'saved' | 'error'>('unsaved')
  function update(key: keyof SchoolForm, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
    setNotice('unsaved')
  }
  function save(preview: boolean) {
    const enteredKeywords = keywords
      .map((value, index) => ({ value, index }))
      .filter((item) => item.value !== '')
    const result = schoolFormSchema.safeParse({
      ...values,
      keywords: enteredKeywords.map((item) => item.value),
    })
    if (!result.success) {
      setErrors(
        result.error.issues.map((issue) => ({
          fieldId:
            issue.path[0] === 'keywords'
              ? `school-keyword-${enteredKeywords[typeof issue.path[1] === 'number' ? issue.path[1] : 0]?.index ?? 0}`
              : `school-${String(issue.path[0])}`,
          message:
            issue.path[0] === 'site'
              ? 'http:// または https:// ではじまるURLを入力してください。'
              : issue.message,
        })),
      )
      return
    }
    setErrors([])
    const saved = saveSchool(result.data)
    setNotice(saved ? 'saved' : 'error')
    if (preview) navigate('/school/listing/preview')
  }
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    save(true)
  }
  return (
    <SchoolLayout
      title="学校情報の編集"
      intro="学校の基本情報と、高校生に伝えたい特色を入力してください。"
      stage="schoolInformation"
    >
      <div className="workflow-toolbar">
        <Button variant="secondary" disabled title="Excel読込は準備中です">
          Excelから読み込む
        </Button>
        <Button
          variant="secondary"
          icon={<Icon name="download" />}
          disabled
          title="入力テンプレートは準備中です"
        >
          入力テンプレート
        </Button>
        <span>.xlsx形式・準備中</span>
      </div>
      <form noValidate className="form-stack" onSubmit={submit}>
        <ErrorSummary errors={errors} />
        <div className="workflow-columns">
          <div className="workflow-panels">
            <section className="panel form-stack">
              <h2>基本情報</h2>
              <div className="workflow-divider" />
              {(['name', 'location', 'field', 'site'] as const).map((key) => (
                <FormField
                  key={key}
                  id={`school-${key}`}
                  label={
                    {
                      name: '学校名・キャンパス名',
                      field: '学びの分野',
                      location: '所在地',
                      site: '学校公式サイト',
                    }[key]
                  }
                  fieldClassName={
                    key === 'field' ? 'workflow-field--short' : undefined
                  }
                  type={key === 'site' ? 'url' : 'text'}
                  required={key !== 'site'}
                  value={values[key]}
                  onChange={(event) => update(key, event.target.value)}
                  error={
                    errors.find((error) => error.fieldId === `school-${key}`)
                      ?.message
                  }
                />
              ))}
              <div className="select-field">
                <label
                  htmlFor="school-prefecture_code"
                  className="cn-field__label"
                >
                  都道府県
                  <Badge />
                </label>
                <select
                  id="school-prefecture_code"
                  required
                  value={values.prefecture_code}
                  aria-invalid={errors.some(
                    (error) => error.fieldId === 'school-prefecture_code',
                  )}
                  aria-describedby={
                    errors.some(
                      (error) => error.fieldId === 'school-prefecture_code',
                    )
                      ? 'prefecture-error'
                      : undefined
                  }
                  onChange={(event) =>
                    update('prefecture_code', event.target.value)
                  }
                >
                  <option value="">選択してください</option>
                  {prefectures.map((name, i) => (
                    <option key={name} value={String(i + 1).padStart(2, '0')}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.find(
                  (error) => error.fieldId === 'school-prefecture_code',
                ) ? (
                  <p id="prefecture-error" className="field-error">
                    都道府県を選択してください。
                  </p>
                ) : null}
              </div>
            </section>
            <section className="panel form-stack">
              <div className="workflow-section-heading">
                <h2>学校紹介・特色</h2>
                <Button
                  variant="secondary"
                  icon={<Icon name="description" />}
                  disabled
                  title="AIによる下書き作成は準備中です"
                >
                  AIで下書きを作成
                </Button>
              </div>
              <div className="workflow-divider" />
              <FormField
                id="school-description"
                label="学校紹介"
                multiline
                rows={3}
                value={values.description}
                onChange={(event) => update('description', event.target.value)}
              />
              <FormField
                id="school-features"
                label="学べること・学校の特色"
                multiline
                rows={3}
                value={values.features}
                onChange={(event) => update('features', event.target.value)}
              />
            </section>
            <section className="panel form-stack">
              <h2>特徴を表すキーワード</h2>
              <p>「チーム開発」「実習中心」など、最大3件まで入力できます。</p>
              <div className="keyword-fields">
                {keywords.map((keyword, i) => (
                  <FormField
                    key={i}
                    id={`school-keyword-${i}`}
                    label={`キーワード${i + 1}`}
                    value={keyword}
                    error={
                      errors.find(
                        (error) => error.fieldId === `school-keyword-${i}`,
                      )?.message
                    }
                    onChange={(event) => {
                      setKeywords((current) =>
                        current.map((value, index) =>
                          index === i ? event.target.value : value,
                        ),
                      )
                      setNotice('unsaved')
                    }}
                  />
                ))}
              </div>
            </section>
            <section className="panel form-stack workflow-photo">
              <h2>学校の写真</h2>
              <ImagePreview
                initialImage={
                  imageUrl
                    ? { src: imageUrl, alt: '選択済みの学校紹介写真' }
                    : undefined
                }
                onFileChange={(file) => {
                  setImage(file)
                  setNotice('unsaved')
                }}
              />
            </section>
            <section className="panel form-stack">
              <h2>オープンキャンパス</h2>
              <div className="workflow-divider" />
              <FormField
                id="school-event_title"
                label="イベント名"
                value={values.event_title}
                onChange={(event) => update('event_title', event.target.value)}
              />
              <FormField
                id="school-event_date"
                label="開催日"
                type="date"
                fieldClassName="workflow-field--short"
                value={values.event_date}
                onChange={(event) => update('event_date', event.target.value)}
                error={
                  errors.find((error) => error.fieldId === 'school-event_date')
                    ?.message
                }
              />
            </section>
          </div>
          <aside className="panel form-stack workflow-guide">
            <h2>入力の進め方</h2>
            <ol>
              <li>
                <a href="#school-name">基本情報</a>
              </li>
              <li>
                <a href="#school-description">学校紹介・特色</a>
              </li>
              <li>
                <a href="#school-event_title">オープンキャンパス</a>
              </li>
            </ol>
            <div className="workflow-divider" />
            <Icon name="info" />
            <p>入力中の内容は、まだ公開されません。</p>
            <p className="workflow-note">
              下書きはこのタブに保存されます。写真は再読み込みで失われます。
            </p>
            <Button
              variant="secondary"
              icon={<Icon name="help" />}
              onClick={() => navigate('/school#help')}
            >
              ヘルプを見る
            </Button>
          </aside>
        </div>
        <SaveNotice
          state={notice}
          message={
            notice === 'saved'
              ? '学校情報をこのタブの下書きに保存しました。写真は再読み込みで失われます。'
              : notice === 'error'
                ? 'タブ内に保存できませんでした。入力内容はこの画面を開いている間のみ保持されます。'
                : undefined
          }
          onRetry={notice === 'error' ? () => save(false) : undefined}
        />
        <div className="page-actions">
          <Button
            variant="secondary"
            showIcon={false}
            onClick={() => save(false)}
          >
            下書きを保存
          </Button>
          <Button type="submit">掲載内容を確認する</Button>
        </div>
      </form>
    </SchoolLayout>
  )
}
