import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import './ui.css'

export type CheckboxProps = Omit<
  ComponentProps<'input'>,
  'type' | 'children'
> & { label: ReactNode }

export function Checkbox({
  label,
  id,
  className = '',
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  return (
    <label
      className={`cn-ui cn-checkbox ${className}`}
      htmlFor={id ?? generatedId}
    >
      <input
        {...props}
        id={id ?? generatedId}
        disabled={disabled}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  )
}
