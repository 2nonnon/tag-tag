<script setup lang="ts">
import { open } from '@tauri-apps/api/dialog'
import { readDir } from '@tauri-apps/api/fs'
import { convertFileSrc } from '@tauri-apps/api/tauri'

const workDir = useStorage('WorkDir', '')

const images = ref<Array<string>>([])

async function hnadleChooeseFloder() {
  const selected = await open({
    directory: true,
    multiple: false,
  }) as string | null
  if (selected) {
    workDir.value = selected
    const res = await getAllFilesInDir(selected)

    images.value = res.map(item => item.url)
  }
  else {
    console.log('你也没选啊')
  }
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
</script>

<template>
  <Layout>
    <div class="container">
      {{ workDir }}
    </div>

    <Button @click="hnadleChooeseFloder">
      选择文件夹
    </Button>

    <div v-for="(img, index) in images" :key="index">
      <img :src="img">
    </div>
  </Layout>
</template>

<style scoped></style>
