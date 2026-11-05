import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'
import './ui.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  icon?: ReactNode
  showIcon?: boolean
}

export function Button({
  variant = 'primary',
  icon,
  showIcon = true,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`cn-ui cn-button cn-button--${variant} ${className}`}
    >
      {showIcon
        ? (icon ?? (
            <Icon name={variant === 'primary' ? 'arrowForward' : 'upload'} />
          ))
        : null}
      <span>{children}</span>
    </button>
  )
}
