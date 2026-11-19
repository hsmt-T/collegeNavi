import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { schoolStaffFormSchema } from '@collegenavi/schemas'
import { SchoolLayout } from '../features/school/SchoolLayout'
import { useSchoolDraft } from '../features/school/draft'
import { FormField } from '../components/ui/FormField'
import { ErrorSummary } from '../components/ui/ErrorSummary'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { Alert } from '../components/ui/Alert'

export function SchoolStaffRegisterPage() {
  const { staffEmail, setStaffEmail, registration, setRegistration } =
    useSchoolDraft()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    staff_name: registration.staff_name,
    email: staffEmail,
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>(
    [],
  )
  const [reviewed, setReviewed] = useState(false)
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = schoolStaffFormSchema.safeParse(values)
    if (!result.success) {
      setErrors(
        result.error.issues.map((issue) => ({
          fieldId: `staff-${String(issue.path[0])}`,
          message:
            issue.path[0] === 'email'
              ? '有効なメールアドレスを入力してください。'
              : issue.message,
        })),
      )
      return
    }
    if (!reviewed) {
      setErrors([
        { fieldId: 'staff-reviewed', message: '入力内容を確認してください。' },
      ])
      return
    }
    setRegistration({
      staff_name: result.data.staff_name,
    })
    setStaffEmail(result.data.email)
    // パスワードは次画面に渡さず、保存・送信しない。
    setValues({
      staff_name: result.data.staff_name,
      email: result.data.email,
      password: '',
      password_confirmation: '',
    })
    navigate('/school/edit')
  }
  return (
    <SchoolLayout
      title="担当者アカウントの登録"
      intro="学校情報の登録に使用するアカウントを作成します。"
      stage="registration"
    >
      <form
        className="panel form-stack registration-form"
        noValidate
        onSubmit={submit}
      >
        <h2>担当者情報</h2>
        <div className="workflow-divider" />
        <FormField
          id="staff-staff_name"
          label="担当者氏名"
          required
          autoComplete="name"
          fieldClassName="workflow-field--short"
          value={values.staff_name}
          onChange={(event) =>
            setValues({ ...values, staff_name: event.target.value })
          }
          error={
            errors.find((error) => error.fieldId === 'staff-staff_name')
              ?.message
          }
        />
        <ErrorSummary errors={errors} />
        {(['email', 'password', 'password_confirmation'] as const).map(
          (key) => (
            <FormField
              key={key}
              id={`staff-${key}`}
              label={
                key === 'email'
                  ? 'メールアドレス'
                  : key === 'password'
                    ? 'パスワード'
                    : 'パスワード（確認）'
              }
              type={key === 'email' ? 'email' : 'password'}
              autoComplete={key === 'email' ? 'email' : 'new-password'}
              fieldClassName={
                key === 'email' ? undefined : 'workflow-field--short'
              }
              helperText={
                key === 'email'
                  ? '確認メールを受け取れるメールアドレスを入力してください。'
                  : key === 'password'
                    ? '第三者に推測されにくいパスワードを設定してください。'
                    : undefined
              }
              required
              value={values[key]}
              onChange={(event) =>
                setValues({ ...values, [key]: event.target.value })
              }
              error={
                errors.find((error) => error.fieldId === `staff-${key}`)
                  ?.message
              }
            />
          ),
        )}
        <Checkbox
          id="staff-reviewed"
          label="入力内容を確認しました"
          checked={reviewed}
          onChange={(event) => setReviewed(event.target.checked)}
        />
        <p className="workflow-note">
          利用規約・プライバシーポリシーは準備中です。正式な登録時にご案内します。
        </p>
        <div className="workflow-divider" />
        <div className="page-actions">
          <Button type="submit">学校情報の入力へ</Button>
        </div>
        <Alert>
          現在は掲載準備のみ利用できます。次へ進んでもアカウントは登録されず、パスワードは保存・送信されません。
        </Alert>
      </form>
      <p className="workflow-note">登録済みの方のログイン機能は準備中です。</p>
    </SchoolLayout>
  )
}
