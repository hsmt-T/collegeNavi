import type { ComponentProps, ReactNode } from 'react'
import { Icon } from '../ui/Icon'
import './navigation.css'

export type HeaderLink = Omit<ComponentProps<'a'>, 'children'> & {
  href: string
  label?: string
}

export type HeaderProps = ComponentProps<'header'> & {
  brandName?: string
  brandHref?: string
  brandIcon?: ReactNode
  appName?: string
  helpLink: HeaderLink
  accountLink: HeaderLink
}

/** 学校担当者向けの共通ヘッダー。リンク先は呼び出し元で指定します。 */
export function Header({
  brandName = 'カレッジナビ',
  brandHref = '/',
  brandIcon = <Icon name="school" size={24} />,
  appName = '学校管理',
  helpLink,
  accountLink,
  className = '',
  children,
  ...props
}: HeaderProps) {
  const {
    label: helpLabel = 'ヘルプ',
    className: helpClassName = '',
    ...helpProps
  } = helpLink
  const {
    label: accountLabel = '学校担当者',
    className: accountClassName = '',
    ...accountProps
  } = accountLink
  return (
    <header {...props} className={`cn-ui cn-header ${className}`}>
      <a className="cn-header__brand" href={brandHref}>
        {brandIcon}
        <span>{brandName}</span>
      </a>
      <span className="cn-header__app-name">{appName}</span>
      <nav className="cn-header__actions" aria-label="ヘルプとアカウント">
        <a {...helpProps} className={`cn-header__link ${helpClassName}`}>
          <Icon name="help" />
          <span>{helpLabel}</span>
        </a>
        <a {...accountProps} className={`cn-header__link ${accountClassName}`}>
          <Icon name="account" />
          <span>{accountLabel}</span>
        </a>
      </nav>
      {children}
    </header>
  )
}
