import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'
import './ui.css'

export type StepItemProps = HTMLAttributes<HTMLDivElement> & {
  state?: 'current' | 'upcoming' | 'complete'
  icon?: ReactNode
  showIcon?: boolean
}

export function StepItem({
  state = 'current',
  icon,
  showIcon = true,
  children,
  className = '',
  ...props
}: StepItemProps) {
  return (
    <div
      {...props}
      aria-current={state === 'current' ? 'step' : undefined}
      className={`cn-ui cn-step cn-step--${state} ${className}`}
    >
      {showIcon
        ? (icon ?? (
            <Icon
              name={state === 'complete' ? 'checkCircle' : 'radioChecked'}
            />
          ))
        : null}
      <span>{children}</span>
      {state === 'complete' ? (
        <span className="cn-sr-only">（完了）</span>
      ) : null}
    </div>
  )
}
