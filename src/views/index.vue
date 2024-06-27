<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/data'

const dataStore = useDataStore()

const { updateFiles } = dataStore

const { files, hasWorkDir } = storeToRefs(dataStore)

onMounted(() => {
  if (hasWorkDir.value) {
    updateFiles()
  }
})
</script>

<template>
  <Layout>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 p-6">
      <file-card v-for="item in files" :key="item.path" :name="item.name" :src="item.url" />
    </div>
  </Layout>
</template>

<style scoped></style>
