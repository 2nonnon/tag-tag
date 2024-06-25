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
      <div v-for="item in files" :key="item.path">
        <div class="w-full aspect-square overflow-hidden rounded-md mb-2">
          <img class="h-full w-full object-cover" :src="item.url" :alt="item.name">
        </div>
        <div class="text-ellipsis overflow-hidden font-bold">
          {{ item.name }}
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped></style>
