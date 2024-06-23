import { drawerApiInjectionKey } from './context'

export default function useDrawer() {
  return inject(drawerApiInjectionKey)!
}
