import { useId } from 'react'
import type { ComponentProps } from 'react'
import { Icon } from './Icon'
import './feedback.css'

export type FieldError = { fieldId: string; message: string }
export type ErrorSummaryProps = ComponentProps<'div'> & {
  errors: readonly FieldError[]
  title?: string
}

/** 検証済みのエラーを表示します。fieldIdは入力要素のidを指定してください。 */
export function ErrorSummary({
  errors,
  title = '入力内容を確認してください',
  className = '',
  ...props
}: ErrorSummaryProps) {
  const titleId = useId()
  if (errors.length === 0) return null
  return (
    <div
      {...props}
      role="alert"
      tabIndex={-1}
      aria-labelledby={titleId}
      className={`cn-ui cn-error-summary ${className}`}
    >
      <p id={titleId} className="cn-error-summary__title">
        <Icon name="info" />
        {title}（{errors.length}件）
      </p>
      <ul>
        {errors.map(({ fieldId, message }, index) => (
          <li key={`${fieldId}-${index}`}>
            <a
              href={`#${encodeURIComponent(fieldId)}`}
              onClick={(event) => {
                const field = document.getElementById(fieldId)
                if (field) {
                  event.preventDefault()
                  field.focus()
                  field.scrollIntoView({ block: 'center' })
                }
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
