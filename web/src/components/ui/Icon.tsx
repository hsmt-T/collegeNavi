import type { HTMLAttributes } from 'react'
import '@fontsource/material-icons'
import './ui.css'

const glyphs = {
  arrowForward: '\uE5C8',
  upload: '\uE2C6',
  radioChecked: '\uE837',
  checkCircle: '\uE86C',
  image: '\uE3F4',
  info: '\uE88E',
  school: '\uE80C',
  help: '\uE8FD',
  account: '\uE853',
  visibility: '\uE8F4',
  payment: '\uE870',
  settings: '\uE8B8',
} as const

export type IconName = keyof typeof glyphs

export type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  name: IconName
  size?: 20 | 24 | 28
}

/** Figmaと同じMaterial Iconsのグリフを使用します。装飾用です。 */
export function Icon({ name, size = 20, className = '', ...props }: IconProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={`cn-icon cn-icon--${size} ${className}`}
    >
      {glyphs[name]}
    </span>
  )
}
