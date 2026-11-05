import type { ComponentProps } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import './feedback.css'

export type SaveState = 'unsaved' | 'saving' | 'saved' | 'error'
export type SaveNoticeProps = ComponentProps<'div'> & {
  state: SaveState
  message?: string
  onRetry?: () => void
}
const labels: Record<SaveState, string> = {
  unsaved: '変更はまだ保存されていません。',
  saving: '保存しています…',
  saved: '保存しました。',
  error: '保存できませんでした。もう一度お試しください。',
}

/** 自動消去しない通知。実際の保存状態は呼び出し元から渡します。 */
export function SaveNotice({
  state,
  message,
  onRetry,
  className = '',
  ...props
}: SaveNoticeProps) {
  return (
    <div
      {...props}
      className={`cn-ui cn-save-notice cn-save-notice--${state} ${className}`}
    >
      <div
        role={state === 'error' ? 'alert' : 'status'}
        aria-atomic="true"
        className="cn-save-notice__message"
      >
        {state === 'saving' ? (
          <span className="cn-spinner" aria-hidden="true" />
        ) : (
          <Icon name={state === 'saved' ? 'checkCircle' : 'info'} />
        )}
        <span>{message ?? labels[state]}</span>
      </div>
      {state === 'error' && onRetry ? (
        <Button variant="secondary" showIcon={false} onClick={onRetry}>
          再試行
        </Button>
      ) : null}
    </div>
  )
}
