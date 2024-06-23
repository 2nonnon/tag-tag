import type { VNodeChild } from 'vue'

export interface DrawerDefineProps {
  title?: string
  width?: string
  closable?: boolean
  maskClosable?: boolean
  closeOnEsc?: boolean
  loading?: boolean
  positiveText?: string
  negativeText?: string
  onPositiveClick?: (e: MouseEvent) => boolean | Promise<boolean> | any
  onNegativeClick?: (e: MouseEvent) => boolean | Promise<boolean> | any
  onClose?: () => boolean | Promise<boolean> | any
  onAfterEnter?: () => void
  onAfterLeave?: () => void
  onEsc?: () => void
  onMaskClick?: () => void
  destroy: () => void
}

export interface DrawerProps extends DrawerDefineProps {
  key: string
  content: () => VNodeChild
}

export type DrawerOptions = Omit<DrawerProps, 'key' | 'destroy'>

export type DrawerReactive = {
  readonly key: string
  readonly destroy: () => void
} & DrawerOptions

export interface DrawerApiInjection {
  create: (options: DrawerOptions) => DrawerReactive
}
