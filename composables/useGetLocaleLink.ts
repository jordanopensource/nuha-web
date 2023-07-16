import { get } from '@vueuse/core'

export default function (): (link: string) => string {
  return (link: string): string => {
    const { locale } = useI18n()
    if (get(locale) !== 'en') {
      return `/${get(locale)}${link}`
    }
    return link
  }
}
