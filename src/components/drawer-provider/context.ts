import type { InjectionKey } from 'vue'
import type { DrawerApiInjection } from './type'

export const drawerApiInjectionKey = Symbol('drawer') as InjectionKey<DrawerApiInjection>
