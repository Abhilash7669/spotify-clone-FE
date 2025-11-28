import type { ComboList } from '@/lib/types/common.type'

export type NavItem = ComboList & {
  icon?: string | null;
  color?: string | null;
}

export type NavList = Array<NavItem>
