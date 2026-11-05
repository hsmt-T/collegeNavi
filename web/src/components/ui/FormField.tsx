import { useId } from 'react'
import type { ReactNode } from 'react'
import { Badge } from './Badge'
import { Input, Textarea } from './Input'
import type { InputProps, TextareaProps } from './Input'
import './ui.css'

type FieldProps = {
  label: ReactNode
  helperText?: ReactNode
  error?: string
  fieldClassName?: string
}

export type FormFieldProps = FieldProps &
  (({ multiline?: false } & InputProps) | ({ multiline: true } & TextareaProps))

export function FormField({
  label,
  helperText,
  error,
  fieldClassName = '',
  ...props
}: FormFieldProps) {
  const generatedId = useId()
  const id = props.id ?? generatedId
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy =
    [props['aria-describedby'], helperId, errorId].filter(Boolean).join(' ') ||
    undefined
  const accessibility = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? (true as const) : props['aria-invalid'],
  }
  let control: ReactNode
  if (props.multiline) {
    const { multiline, ...textareaProps } = props
    void multiline
    control = <Textarea {...textareaProps} {...accessibility} />
  } else {
    const { multiline, ...inputProps } = props
    void multiline
    control = <Input {...inputProps} {...accessibility} />
  }
  return (
    <div className={`cn-ui cn-field ${fieldClassName}`}>
      <label htmlFor={id} className="cn-field__label">
        {label}
        {props.required ? <Badge /> : null}
      </label>
      {helperText ? (
        <p id={helperId} className="cn-field__helper">
          {helperText}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} className="cn-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
