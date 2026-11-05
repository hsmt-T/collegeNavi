import type { ComponentProps, ReactNode } from 'react'
import './ui.css'

export type NavItemProps = ComponentProps<'a'> & {
  href: string
  selected?: boolean
  icon?: ReactNode
}

export function NavItem({
  selected = false,
  icon,
  children,
  className = '',
  ...props
}: NavItemProps) {
  return (
    <a
      {...props}
      aria-current={selected ? 'page' : undefined}
      className={`cn-ui cn-nav-item ${className}`}
    >
      {icon}
      <span>{children}</span>
    </a>
  )
}
