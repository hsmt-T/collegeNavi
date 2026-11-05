import type { ComponentProps } from 'react'
import { StepItem } from '../ui/StepItem'
import './navigation.css'

const stages = [
  { id: 'registration', label: '担当者登録' },
  { id: 'schoolInformation', label: '学校情報' },
  { id: 'preview', label: '表示確認' },
  { id: 'payment', label: '掲載手続き' },
] as const

export type RegistrationStage = (typeof stages)[number]['id']
export type StepperProps = ComponentProps<'nav'> & { stage: RegistrationStage }

export function Stepper({ stage, className = '', ...props }: StepperProps) {
  const current = stages.findIndex((item) => item.id === stage)
  return (
    <nav
      aria-label="学校掲載の登録手順"
      {...props}
      className={`cn-ui cn-stepper ${className}`}
    >
      <ol>
        {stages.map((item, index) => (
          <li key={item.id}>
            <StepItem
              state={
                index < current
                  ? 'complete'
                  : index === current
                    ? 'current'
                    : 'upcoming'
              }
            >
              {item.label}
            </StepItem>
          </li>
        ))}
      </ol>
    </nav>
  )
}
