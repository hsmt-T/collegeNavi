import { useId, useState } from 'react'
import { Stepper } from '../navigation/Stepper'
import type { RegistrationStage } from '../navigation/Stepper'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ErrorSummary } from '../ui/ErrorSummary'
import { FormField } from '../ui/FormField'
import { ImagePreview } from '../ui/ImagePreview'
import { SaveNotice } from '../ui/SaveNotice'
import type { SaveState } from '../ui/SaveNotice'

export function WorkflowPreview() {
  const id = useId()
  const [stage, setStage] = useState<RegistrationStage>('schoolInformation')
  const [saveState, setSaveState] = useState<SaveState>('unsaved')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [failConfirmation, setFailConfirmation] = useState(false)
  const [confirmed, setConfirmed] = useState(0)
  const [showErrors, setShowErrors] = useState(true)
  const [imageName, setImageName] = useState('未選択')
  const errors = showErrors
    ? [
        { fieldId: `${id}-school`, message: '学校名を入力してください。' },
        {
          fieldId: `${id}-email`,
          message: '連絡先メールアドレスを入力してください。',
        },
      ]
    : []

  return (
    <>
      <section>
        <h2>登録ステッパー</h2>
        <label>
          登録段階
          <select
            value={stage}
            onChange={(event) =>
              setStage(event.target.value as RegistrationStage)
            }
          >
            <option value="registration">担当者登録</option>
            <option value="schoolInformation">学校情報</option>
            <option value="preview">表示確認</option>
            <option value="payment">掲載手続き</option>
          </select>
        </label>
        <Stepper stage={stage} />
      </section>
      <section>
        <h2>保存通知</h2>
        <p>状態を切り替えて表示を確認できます。</p>
        <label>
          保存状態
          <select
            value={saveState}
            onChange={(event) => setSaveState(event.target.value as SaveState)}
          >
            <option value="unsaved">未保存</option>
            <option value="saving">保存中</option>
            <option value="saved">保存成功</option>
            <option value="error">保存失敗</option>
          </select>
        </label>
        <SaveNotice state={saveState} onRetry={() => setSaveState('saved')} />
      </section>
      <section>
        <h2>確認ダイアログ</h2>
        <Checkbox
          label="確認処理を失敗させる（表示確認用）"
          checked={failConfirmation}
          onChange={(event) => setFailConfirmation(event.target.checked)}
        />
        <div>
          <Button
            variant="secondary"
            showIcon={false}
            onClick={() => setDialogOpen(true)}
          >
            変更を破棄する
          </Button>
        </div>
        <output aria-live="polite">確認処理の実行回数: {confirmed}</output>
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="変更を破棄しますか？"
          confirmLabel="破棄する"
          cancelLabel="編集を続ける"
          onConfirm={async () => {
            await new Promise((resolve) => window.setTimeout(resolve, 400))
            if (failConfirmation) throw new Error('確認用のエラー')
            setConfirmed((count) => count + 1)
          }}
        >
          <p>
            保存していない変更は失われます。編集を続ける場合はキャンセルしてください。
          </p>
        </ConfirmDialog>
      </section>
      <section>
        <h2>フォームのエラー一覧</h2>
        <Checkbox
          label="エラー一覧を表示する"
          checked={showErrors}
          onChange={(event) => setShowErrors(event.target.checked)}
        />
        <ErrorSummary errors={errors} />
        <FormField
          id={`${id}-school`}
          label="エラー確認用の学校名"
          error={showErrors ? errors[0].message : undefined}
        />
        <FormField
          id={`${id}-email`}
          type="email"
          label="エラー確認用のメールアドレス"
          error={showErrors ? errors[1].message : undefined}
        />
      </section>
      <section>
        <h2>画像プレビュー</h2>
        <ImagePreview
          onFileChange={(file) => setImageName(file?.name ?? '未選択')}
        />
        <output>選択された画像: {imageName}</output>
      </section>
    </>
  )
}
