import { useEffect, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/navigation/Header'
import { Sidebar } from '../../components/navigation/Sidebar'
import { Stepper } from '../../components/navigation/Stepper'
import type { RegistrationStage } from '../../components/navigation/Stepper'
import { createSchoolNavigation } from '../../components/navigation/schoolNavigation'
import { useSchoolDraft } from './draft'
import './school-workflow.css'

const items = createSchoolNavigation({
  schoolInformation: '/school/edit',
  preview: '/school/listing/preview',
  payment: '/school/payment',
  accountSettings: '/school/staff/register',
})
export function SchoolLayout({
  title,
  intro,
  stage,
  children,
}: {
  title: string
  intro?: string
  stage?: RegistrationStage
  children: ReactNode
}) {
  const { school } = useSchoolDraft()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    document.title = `${title} | カレッジナビ`
    heading.current?.focus()
    window.scrollTo(0, 0)
  }, [pathname, title])
  // 既存のa要素を保ち、通常の同一画面内操作だけをSPA遷移にする。
  function routeLink(event: MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const anchor = (event.target as Element).closest('a')
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return
    const url = new URL(anchor.href)
    if (url.origin !== location.origin || url.hash) return
    event.preventDefault()
    navigate(url.pathname + url.search)
  }
  return (
    <div
      className={`cn-ui school-app school-workflow ${stage === 'registration' ? 'school-workflow--registration' : ''}`}
      onClick={routeLink}
    >
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <Header
        brandHref="/school"
        helpLink={{ href: '/school#help' }}
        accountLink={{ href: '/school/staff/register', label: '学校担当者' }}
      />
      <div
        className={
          stage && stage !== 'registration'
            ? 'school-shell'
            : 'school-shell school-shell--wide'
        }
      >
        {stage && stage !== 'registration' ? (
          <Sidebar
            schoolName={school.name || '学校情報を登録してください'}
            items={items}
            activeItem={
              stage === 'schoolInformation' ? 'schoolInformation' : stage
            }
          />
        ) : null}
        <main id="main" className="school-main">
          <div className="page-heading">
            <nav className="workflow-breadcrumb" aria-label="パンくず">
              <Link to="/school">ホーム</Link>
              <span aria-hidden="true">/</span>
              <span>学校掲載</span>
            </nav>
            <h1 ref={heading} tabIndex={-1}>
              {title}
            </h1>
            {intro ? <p>{intro}</p> : null}
          </div>
          {stage ? <Stepper stage={stage} /> : null}
          {children}
        </main>
      </div>
    </div>
  )
}
