import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ComponentPreview } from './ComponentPreview'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComponentPreview />
  </StrictMode>,
)
