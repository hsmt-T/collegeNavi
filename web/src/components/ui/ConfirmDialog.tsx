import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import './feedback.css'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({ open, ...props }: ConfirmDialogProps) {
  return open ? <OpenConfirmDialog {...props} /> : null
}

function OpenConfirmDialog({
  title,
  children,
  onOpenChange,
  onConfirm,
  confirmLabel = '確認する',
  cancelLabel = 'キャンセル',
}: Omit<ConfirmDialogProps, 'open'>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pendingRef = useRef(false)
  const mountedRef = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const titleId = useId()
  const descriptionId = useId()
  useEffect(() => {
    const dialog = dialogRef.current!
    const opener = document.activeElement
    mountedRef.current = true
    dialog.showModal()
    return () => {
      mountedRef.current = false
      dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [])

  async function confirm() {
    if (pendingRef.current) return
    pendingRef.current = true
    setPending(true)
    setError('')
    try {
      await onConfirm()
      if (mountedRef.current) onOpenChange(false)
    } catch {
      if (mountedRef.current)
        setError('処理を完了できませんでした。もう一度お試しください。')
    } finally {
      pendingRef.current = false
      if (mountedRef.current) setPending(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="cn-ui cn-confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        if (!pendingRef.current) onOpenChange(false)
      }}
    >
      <h2 id={titleId}>{title}</h2>
      <div id={descriptionId} className="cn-confirm-dialog__description">
        {children}
      </div>
      {error ? (
        <p role="alert" className="cn-confirm-dialog__error">
          {error}
        </p>
      ) : null}
      <div className="cn-confirm-dialog__actions">
        <Button
          variant="secondary"
          showIcon={false}
          disabled={pending}
          autoFocus
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button showIcon={false} disabled={pending} onClick={confirm}>
          {pending ? '処理中…' : confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
