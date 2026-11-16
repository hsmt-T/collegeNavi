import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { SchoolDraftProvider } from './features/school/SchoolDraftProvider'
import { SchoolLandingPage } from './pages/SchoolLandingPage'
import { SchoolStaffRegisterPage } from './pages/SchoolStaffRegisterPage'
import { SchoolEditPage } from './pages/SchoolEditPage'
import { SchoolListingPreviewPage } from './pages/SchoolListingPreviewPage'
import { SchoolPaymentPage } from './pages/SchoolPaymentPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <SchoolDraftProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/school" replace />} />
          <Route path="/school" element={<SchoolLandingPage />} />
          <Route
            path="/school/staff/register"
            element={<SchoolStaffRegisterPage />}
          />
          <Route path="/school/edit" element={<SchoolEditPage />} />
          <Route
            path="/school/listing/preview"
            element={<SchoolListingPreviewPage />}
          />
          <Route path="/school/payment" element={<SchoolPaymentPage />} />
          <Route
            path="*"
            element={
              <main className="not-found">
                <h1>ページが見つかりません</h1>
                <Link to="/school">学校担当者向けトップへ</Link>
              </main>
            }
          />
        </Routes>
      </SchoolDraftProvider>
    </BrowserRouter>
  )
}
