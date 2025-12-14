export type LinkGroup = 'desktop-header' | 'footer' | 'mobile-header' | "social" | "info"

export interface Link {
  title(): string
  path(): string
  external?: boolean
  icon?: string
  groups?: LinkGroup[]
}

export const useLinks = () => {
  
  const { t } = useI18n()
  const localePath = useLocalePath()

  const allLinks: Link[] = [
    {
      path: () => 'https://github.com/jordanopensource/nuha-web',
      title: () => t('links.social.github'),
      external: true,
      icon: 'mdi:github',
      groups: ['footer', "social"],
    },
    {
      path: () => 'https://instagram.com/jordanopensource',
      title: () => t('links.social.instagram'),
      external: true,
      icon: 'mdi:instagram',
      groups: ['footer', "social"],
    },
    {
      path: () => localePath('/publications'),
      title: () => t('links.general.publications'),
      groups: ['desktop-header', 'mobile-header', "footer"],
    },
    {
      path: () => localePath('/about'),
      title: () => t('links.general.about'),
      groups: ['footer', "mobile-header", "desktop-header", "info"],
    },
    {
      path: () => localePath('/analyze'),
      title: () => t('links.general.analyze'),
      groups: ['desktop-header', "mobile-header", "footer"],
    },
    {
      path: () => localePath('/terms'),
      title: () => t('links.footer.terms'),
      groups: ['footer', "info"],
    },
    {
      path: () => localePath('/privacy'),
      title: () => t('links.footer.privacy'),
      groups: ['footer', "info"],
    },
  ]

  const getLinksByGroup = (group: LinkGroup): Link[] =>
    allLinks.filter(link => link.groups?.includes(group))

  return {
    allLinks,
    getLinksByGroup,
  }
}
