export const ARTIST_DETAILS_TABS: { label: string; icon: string; value: detailsTabsValue }[] = [
  {
    label: 'Popular',
    icon: 'lucide:trending-up',
    value: 'popular',
  },
  {
    label: 'Latest Release',
    icon: 'lucide:sparkles',
    value: 'latest release',
  },
]

export type detailsTabsValue = 'latest release' | 'popular'
