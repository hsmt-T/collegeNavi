import { createContext, useContext } from 'react'
import type { SchoolForm } from '@collegenavi/schemas'

export const emptySchool: SchoolForm = {
  name: '',
  location: '',
  field: '',
  site: '',
  description: '',
  features: '',
  prefecture_code: '',
  keywords: [],
  event_title: '',
  event_date: '',
}
export type SchoolDraftContextValue = {
  school: SchoolForm
  saveSchool: (value: SchoolForm) => boolean
  registration: { school_name: string; staff_name: string }
  setRegistration: (value: { school_name: string; staff_name: string }) => void
  staffEmail: string
  setStaffEmail: (email: string) => void
  image: File | null
  setImage: (image: File | null) => void
  imageUrl: string | undefined
}
export const SchoolDraftContext = createContext<SchoolDraftContextValue | null>(
  null,
)
export function useSchoolDraft() {
  const context = useContext(SchoolDraftContext)
  if (!context) throw new Error('SchoolDraftProvider が必要です。')
  return context
}
