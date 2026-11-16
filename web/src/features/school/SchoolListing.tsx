import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'
import { useSchoolDraft } from './draft'

export function SchoolListing() {
  const { school, imageUrl } = useSchoolDraft()
  return (
    <article className="panel workflow-listing">
      <p className="workflow-note">学校詳細</p>
      {imageUrl ? (
        <img
          className="workflow-listing__image"
          src={imageUrl}
          alt={`${school.name}の紹介写真`}
        />
      ) : (
        <div className="workflow-listing__image workflow-listing__image--empty">
          <Icon name="image" size={28} />
          <span>学校写真</span>
        </div>
      )}
      <h2>{school.name}</h2>
      <p className="workflow-note">
        {school.location} ｜ {school.field}
      </p>
      <div className="workflow-divider" />
      <h3>学校について</h3>
      <p className="preserve-lines">
        {school.description || '紹介文は未入力です。'}
      </p>
      <h3>学べること・特色</h3>
      <p className="preserve-lines">
        {school.features || '特色は未入力です。'}
      </p>
      {school.keywords.length ? (
        <div className="keyword-list">
          {school.keywords.map((keyword) => (
            <Badge key={keyword}>{keyword}</Badge>
          ))}
        </div>
      ) : null}
      {school.site ? (
        <a href={school.site} target="_blank" rel="noreferrer">
          学校公式サイト（別タブ）
        </a>
      ) : null}
      <div className="workflow-divider" />
      <h3 className="workflow-icon-heading">
        <Icon name="calendar" />
        オープンキャンパス
      </h3>
      {school.event_title ? (
        <>
          <p>
            <strong>
              {new Intl.DateTimeFormat('ja-JP', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
                timeZone: 'Asia/Tokyo',
              }).format(new Date(`${school.event_date}T00:00:00+09:00`))}
              {school.event_title}
            </strong>
          </p>
          <details className="workflow-event-details">
            <summary>イベントの詳細を見る</summary>
            <dl>
              <dt>イベント名</dt>
              <dd>{school.event_title}</dd>
              <dt>開催日</dt>
              <dd>{school.event_date}</dd>
              <dt>会場</dt>
              <dd>{school.location}</dd>
            </dl>
          </details>
        </>
      ) : (
        <p className="workflow-note">イベントは未登録です。</p>
      )}
    </article>
  )
}
