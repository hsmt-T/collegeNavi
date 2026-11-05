import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'
import './ui.css'

export type FeatureRowProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode
  description: ReactNode
  icon?: ReactNode
  showIcon?: boolean
}

export function FeatureRow({
  title,
  description,
  icon,
  showIcon = true,
  className = '',
  ...props
}: FeatureRowProps) {
  return (
    <div {...props} className={`cn-ui cn-feature ${className}`}>
      {showIcon ? (icon ?? <Icon name="upload" size={28} />) : null}
      <div className="cn-feature__content">
        <p className="cn-feature__title">{title}</p>
        <p className="cn-feature__description">{description}</p>
      </div>
    </div>
  )
}
