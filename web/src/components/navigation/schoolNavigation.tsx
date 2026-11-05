import { Icon } from '../ui/Icon'
import type { SidebarItem } from './Sidebar'

export type SchoolNavigationId =
  'schoolInformation' | 'preview' | 'payment' | 'accountSettings'

/** ルーティングを決めず、呼び出し元のURLで標準の4項目を作成します。 */
export function createSchoolNavigation(
  hrefs: Record<SchoolNavigationId, string>,
): SidebarItem[] {
  return [
    {
      id: 'schoolInformation',
      label: '学校情報',
      href: hrefs.schoolInformation,
      icon: <Icon name="school" />,
    },
    {
      id: 'preview',
      label: '掲載内容の確認',
      href: hrefs.preview,
      icon: <Icon name="visibility" />,
    },
    {
      id: 'payment',
      label: '掲載プラン・支払い',
      href: hrefs.payment,
      icon: <Icon name="payment" />,
    },
    {
      id: 'accountSettings',
      label: 'アカウント設定',
      href: hrefs.accountSettings,
      icon: <Icon name="settings" />,
    },
  ]
}
