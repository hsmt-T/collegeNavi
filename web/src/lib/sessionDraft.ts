/** ブラウザー内の下書き。読めない場合もフォームは利用可能にする。 */
export function readSessionDraft(key: string): unknown {
  try {
    const value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeSessionDraft(key: string, value: unknown): boolean {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
