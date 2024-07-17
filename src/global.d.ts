import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'
import type { ModalApiInjection } from 'naive-ui/es/modal/src/ModalProvider'
import type { DrawerApiInjection } from '@/components/drawer-provider/type'

declare global {
  interface Window {
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $loading: LoadingBarApiInjection
    $drawer: DrawerApiInjection
    $modal: ModalApiInjection
  }

  type ComponentsExposed<T> = Required<Parameters<Required<ReturnType<T>>['__ctx']['expose']>[0]>

  type Nullable<T extends object> = {
    [P in keyof T]: T[P] | null
  }

  type MaybeEmpty<T extends object> = Nullable<Partial<T>>
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

export {}
