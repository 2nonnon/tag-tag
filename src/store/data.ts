import { defineStore } from 'pinia'
import { open } from '@tauri-apps/api/dialog'
import { readDir } from '@tauri-apps/api/fs'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { store } from '.'

export const useDataStore = defineStore('data', () => {
  const workDir = useStorage('WorkDir', '')

  const hasWorkDir = computed(() => !!workDir.value)

  const files = shallowRef<Array<{ name?: string, url: string, path: string }>>([])

  async function chooseDir() {
    const selected = await open({
      directory: true,
      multiple: false,
    }) as string | null
    if (selected) {
      workDir.value = selected
      const res = await getAllFilesInDir(selected)

      files.value = res
    }
    else {
      console.log('你也没选啊')
    }
  }

  async function updateFiles() {
    files.value = await getAllFilesInDir(workDir.value)
  }

  async function getAllFilesInDir(dir: string) {
    const entries = await readDir(dir, { recursive: false })

    const res = await Promise.all(
      entries.map(async (entry) => {
        const url = convertFileSrc(`${entry.path}`)

        return { ...entry, url }
      }),
    )

    return res
  }

  return { workDir, files, hasWorkDir, chooseDir, getAllFilesInDir, updateFiles }
})

export function useDataStoreWidthOut() {
  return useDataStore(store)
}
