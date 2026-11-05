import type { HTMLAttributes } from 'react'
import './ui.css'

export function Badge({
  children = '必須',
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={`cn-ui cn-badge ${className}`}>
      {children}
    </span>
  )
}
