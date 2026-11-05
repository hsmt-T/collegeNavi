import { useEffect, useId, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import './feedback.css'

export type ImagePreviewProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  label?: string
  initialImage?: { src: string; alt: string }
  maxSizeBytes?: number
  disabled?: boolean
  onFileChange?: (file: File | null) => void
}
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']

/** ローカルで選択・表示します。サーバーへのアップロードは呼び出し元の責務です。 */
export function ImagePreview({
  label = '掲載写真',
  initialImage,
  maxSizeBytes = 5 * 1024 * 1024,
  disabled = false,
  onFileChange,
  className = '',
  ...props
}: ImagePreviewProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<string | null>(null)
  const [selection, setSelection] = useState<{
    src: string
    name: string
  } | null>(null)
  const [removed, setRemoved] = useState(false)
  const [error, setError] = useState('')
  const src = selection?.src ?? (removed ? undefined : initialImage?.src)
  const alt = selection
    ? `${label}: ${selection.name}`
    : (initialImage?.alt ?? label)
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )
  function releaseUrl() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
  }
  return (
    <div {...props} className={`cn-ui cn-image-preview ${className}`}>
      <label className="cn-image-preview__label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={acceptedTypes.join(',')}
        disabled={disabled}
        className="cn-sr-only"
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}
        aria-invalid={Boolean(error)}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (!file) return
          if (!acceptedTypes.includes(file.type)) {
            setError('JPEG・PNG・WebP形式の画像を選択してください。')
            return
          }
          if (file.size === 0 || file.size > maxSizeBytes) {
            setError(
              `空のファイル、または${Math.round((maxSizeBytes / 1024 / 1024) * 10) / 10}MBを超えるファイルは選択できません。`,
            )
            return
          }
          releaseUrl()
          const nextUrl = URL.createObjectURL(file)
          urlRef.current = nextUrl
          setSelection({ src: nextUrl, name: file.name })
          setRemoved(false)
          setError('')
          onFileChange?.(file)
        }}
      />
      <div className="cn-image-preview__frame">
        {src ? (
          <img
            key={src}
            src={src}
            alt={alt}
            onLoad={() => setError('')}
            onError={() =>
              setError('画像を表示できません。別の画像を選択してください。')
            }
          />
        ) : (
          <span className="cn-image-preview__empty">
            <Icon name="image" size={28} />
            画像が選択されていません
          </span>
        )}
      </div>
      <p id={`${id}-help`} className="cn-image-preview__help">
        JPEG・PNG・WebP、{Math.round((maxSizeBytes / 1024 / 1024) * 10) / 10}
        MBまで
      </p>
      {error ? (
        <p role="alert" id={`${id}-error`} className="cn-image-preview__error">
          {error}
        </p>
      ) : null}
      <p className="cn-image-preview__filename" role="status">
        {selection?.name ?? (src ? '登録済みの画像' : '未選択')}
      </p>
      <div className="cn-image-preview__actions">
        <Button
          variant="secondary"
          showIcon={false}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {src ? '画像を差し替える' : '画像を選択する'}
        </Button>
        {src ? (
          <Button
            variant="secondary"
            showIcon={false}
            disabled={disabled}
            onClick={() => {
              releaseUrl()
              setSelection(null)
              setRemoved(true)
              setError('')
              onFileChange?.(null)
              inputRef.current?.focus()
            }}
          >
            画像を削除する
          </Button>
        ) : null}
      </div>
    </div>
  )
}
