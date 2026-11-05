import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'
import './ui.css'

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode
  showIcon?: boolean
}

export function Alert({
  children,
  icon,
  showIcon = true,
  className = '',
  role = 'status',
  ...props
}: AlertProps) {
  return (
    <div {...props} role={role} className={`cn-ui cn-alert ${className}`}>
      {showIcon ? (icon ?? <Icon name="info" />) : null}
      <span>{children}</span>
    </div>
  )
}
