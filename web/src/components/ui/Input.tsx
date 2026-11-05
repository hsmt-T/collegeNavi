import type { ComponentProps } from 'react'
import './ui.css'

export type InputProps = ComponentProps<'input'>
export type TextareaProps = ComponentProps<'textarea'>

export function Input({ className = '', ...props }: InputProps) {
  return <input {...props} className={`cn-ui cn-input ${className}`} />
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`cn-ui cn-input cn-textarea ${className}`}
    />
  )
}
