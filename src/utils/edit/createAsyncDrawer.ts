import type { DrawerOptions } from '@/components/drawer-provider/type'

export type AsyncDrawerOptions<T> = Omit<DrawerOptions, 'onPositiveClick'> & {
  onPositiveClick: (e: MouseEvent) => Promise<T>
}

export function createAsyncDrawer<T>({
  onClose,
  onPositiveClick,
  onNegativeClick,
  ...options
}: AsyncDrawerOptions<T>) {
  return new Promise<T>((resolve, reject) => {
    const d = window.$drawer.create({
      ...options,
      onPositiveClick: async (e) => {
        try {
          d.loading = true
          d.closeOnEsc = false
          d.maskClosable = false
          d.closable = false

          const res = await onPositiveClick(e)

          resolve(res)

          return true
        }
        catch (e) {
          reject()

          return false
        }
        finally {
          d.loading = false
          d.closeOnEsc = options.closeOnEsc ?? true
          d.maskClosable = options.maskClosable ?? true
          d.closable = options.closable ?? true
        }
      },
      onNegativeClick: async (e) => {
        if (d.loading)
          return false

        try {
          const res = await onNegativeClick?.(e)

          if (res !== false)
            reject()

          return res
        }
        catch (e) {
          return false
        }
      },
      onClose: async () => {
        try {
          const res = await onClose?.()

          if (res !== false)
            reject()

          return res
        }
        catch (e) {
          return false
        }
      },
    })
  })
}
