import type { ComponentProps } from 'react'
import { NavItem } from '../ui/NavItem'
import type { NavItemProps } from '../ui/NavItem'
import './navigation.css'

export type SidebarItem = Omit<NavItemProps, 'selected' | 'children'> & {
  id: string
  label: string
}

export type SidebarProps = ComponentProps<'aside'> & {
  schoolName: string
  status?: string
  items: readonly SidebarItem[]
  activeItem?: string
  navigationLabel?: string
}

export function Sidebar({
  schoolName,
  status = '掲載準備中',
  items,
  activeItem,
  navigationLabel = '学校管理メニュー',
  className = '',
  children,
  ...props
}: SidebarProps) {
  return (
    <aside {...props} className={`cn-ui cn-sidebar ${className}`}>
      <p className="cn-sidebar__school">{schoolName}</p>
      <p className="cn-sidebar__status">{status}</p>
      <hr className="cn-sidebar__divider" />
      <nav aria-label={navigationLabel}>
        <ul className="cn-sidebar__items">
          {items.map(({ id, label, ...item }) => (
            <li key={id}>
              <NavItem {...item} selected={id === activeItem}>
                {label}
              </NavItem>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </aside>
  )
}
