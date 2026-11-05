import type { HTMLAttributes, ReactNode } from 'react'
import './ui.css'

export type DescriptionRowProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode
}

/** dlの子として使用します。 */
export function DescriptionRow({
  label,
  children,
  className = '',
  ...props
}: DescriptionRowProps) {
  return (
    <div {...props} className={`cn-ui cn-description ${className}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
