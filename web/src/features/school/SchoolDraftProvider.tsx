import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { schoolFormSchema } from '@collegenavi/schemas'
import type { SchoolForm } from '@collegenavi/schemas'
import { readSessionDraft, writeSessionDraft } from '../../lib/sessionDraft'
import { emptySchool, SchoolDraftContext } from './draft'

const storageKey = 'collegenavi:school-draft:v1'
export function SchoolDraftProvider({ children }: { children: ReactNode }) {
  const [school, setSchool] = useState<SchoolForm>(() => {
    const result = schoolFormSchema.safeParse(readSessionDraft(storageKey))
    return result.success ? result.data : emptySchool
  })
  const [staffEmail, setStaffEmail] = useState('')
  const [registration, setRegistration] = useState({
    school_name: '',
    staff_name: '',
  })
  const [selection, setSelection] = useState<{
    file: File
    url: string
  } | null>(null)
  useEffect(() => {
    return () => {
      if (selection) URL.revokeObjectURL(selection.url)
    }
  }, [selection])
  function setImage(file: File | null) {
    setSelection(file ? { file, url: URL.createObjectURL(file) } : null)
  }
  function saveSchool(value: SchoolForm) {
    setSchool(value)
    return writeSessionDraft(storageKey, value)
  }
  return (
    <SchoolDraftContext
      value={{
        school,
        saveSchool,
        registration,
        setRegistration,
        staffEmail,
        setStaffEmail,
        image: selection?.file ?? null,
        setImage,
        imageUrl: selection?.url,
      }}
    >
      {children}
    </SchoolDraftContext>
  )
}
