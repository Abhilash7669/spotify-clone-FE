export type BaseButtonVariants =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

export type BaseButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

export type BaseButtonVariantStructure = {
  defaultClass: string
  variants: {
    variant: Record<BaseButtonVariants, string>
    size: Record<BaseButtonSize, string>
  }
  defaultVariants: {
    variant: 'default'
    size: 'default'
  }
}
