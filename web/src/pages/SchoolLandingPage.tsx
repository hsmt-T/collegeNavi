import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import schoolEditPageImg from '../assets/SchoolEditPageImg.png'
import { Header } from '../components/navigation/Header'
import { Button } from '../components/ui/Button'
import { FeatureRow } from '../components/ui/FeatureRow'
import { Icon } from '../components/ui/Icon'
import './SchoolLandingPage.css'

const benefits = [
  {
    title: 'Excelからまとめて入力',
    description: 'お手元の学校情報を読み込み、転記の手間を減らせます。',
  },
  {
    title: 'AIで紹介文の作成を補助',
    description:
      '学校の特色をもとに下書きを作成。内容を確認しながら編集できます。',
  },
  {
    title: '掲載前に見た目を確認',
    description: '高校生に表示される内容を、公開前に確かめられます。',
  },
]

export function SchoolLandingPage() {
  const navigate = useNavigate()
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    document.title = 'カレッジナビで簡単入力 | カレッジナビ'
    heading.current?.focus({ preventScroll: true })
    if (window.location.hash === '#help')
      document.getElementById('help')?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [])
  return (
    <div className="cn-ui school-app school-landing">
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <Header
        brandHref="/school"
        helpLink={{ href: '#help' }}
        accountLink={{ href: '/school/staff/register', label: '学校担当者' }}
      />
      <main id="main" className="school-landing__main">
        <div className="school-landing__divider" />
        <section
          className="school-landing__hero"
          aria-labelledby="landing-title"
        >
          <p className="school-landing__audience">
            専門学校の広報・募集担当者の方へ
          </p>
          <h1 ref={heading} tabIndex={-1} id="landing-title">
            カレッジナビで簡単入力
          </h1>
          <p className="school-landing__lead">
            学校情報の登録から、掲載前の確認まで。ひとつの画面でスムーズに。
          </p>
          <div className="school-landing__overview">
            <div className="editor-illustration">
              <img
                className="editor-illustration__image"
                alt="学校編集画面画像"
                src={schoolEditPageImg}
                width={504}
                height={320}
              />
            </div>
            <div className="school-landing__benefits">
              {benefits.map((benefit) => (
                <FeatureRow
                  key={benefit.title}
                  {...benefit}
                  icon={<Icon name="checkCircle" size={28} />}
                />
              ))}
            </div>
          </div>
          <Button onClick={() => navigate('/school/staff/register')}>
            掲載の登録をはじめる
          </Button>
        </section>
        <section
          className="school-landing__features"
          aria-labelledby="features-title"
        >
          <h2 id="features-title">お手元の情報から、無理なく登録できます</h2>
          <FeatureRow
            title="Excelでまとめて入力"
            description="学校案内などの情報をテンプレートに整理して読み込めます。"
            icon={<Icon name="upload" size={28} />}
          />
          <div className="school-landing__divider" />
          <FeatureRow
            title="紹介文の作成を補助"
            description="学校の特色をもとにAIで下書きを作成し、担当者が編集できます。"
            icon={<Icon name="description" size={28} />}
          />
          <div className="school-landing__divider" />
          <FeatureRow
            title="掲載前に確認"
            description="高校生に表示される学校情報を確かめてから手続きできます。"
            icon={<Icon name="visibility" size={28} />}
          />
          <div className="school-landing__divider" />
        </section>
        <section
          id="help"
          className="school-landing__faq"
          aria-labelledby="faq-title"
        >
          <h2 id="faq-title">よくある質問</h2>
          <div className="school-landing__answer">
            <h3>掲載料金はかかりますか？</h3>
            <p>
              料金・契約条件は現在検討中です。確定後、掲載手続きでご案内します。
            </p>
          </div>
        </section>
        <footer className="school-landing__footer">
          <Link to="/school">カレッジナビ</Link>
          <span aria-hidden="true">｜</span>
          <span>利用規約</span>
          <span aria-hidden="true">｜</span>
          <span>プライバシーポリシー</span>
          <span aria-hidden="true">｜</span>
          <span>お問い合わせ</span>
        </footer>
      </main>
    </div>
  )
}
