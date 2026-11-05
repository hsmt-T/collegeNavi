import { useId, useState } from 'react'
import type { ComponentProps } from 'react'
import { Icon } from './Icon'
import './ui.css'

export type FileUploadProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'children'
> & {
  label?: string
  emptyText?: string
}

export function FileUpload({
  label = '写真ファイルを選択',
  emptyText = '掲載写真のサンプルは未設定',
  id,
  className = '',
  onChange,
  disabled,
  ...props
}: FileUploadProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [fileNames, setFileNames] = useState('')
  return (
    <div className={`cn-ui cn-upload ${className}`}>
      <Icon name="image" />
      <label className="cn-upload__label" htmlFor={inputId}>
        <input
          {...props}
          disabled={disabled}
          id={inputId}
          type="file"
          className="cn-sr-only"
          aria-describedby={`${inputId}-selection`}
          onChange={(event) => {
            setFileNames(
              Array.from(
                event.currentTarget.files ?? [],
                (file) => file.name,
              ).join('、'),
            )
            onChange?.(event)
          }}
        />
        <span>{label}</span>
      </label>
      <span
        id={`${inputId}-selection`}
        className="cn-upload__selection"
        aria-live="polite"
      >
        {fileNames || emptyText}
      </span>
    </div>
  )
}
