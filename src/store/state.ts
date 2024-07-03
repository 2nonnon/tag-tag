import { defineStore } from 'pinia'
import { store } from '.'

export const useStateStore = defineStore('state', () => {
  const isMaximized = ref(false)

  function setIsMaximized(value: boolean) {
    isMaximized.value = value
  }

  return { isMaximized, setIsMaximized }
})

export function useStateStoreWidthOut() {
  return useStateStore(store)
}
