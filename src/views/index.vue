<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/data'

const dataStore = useDataStore()

const { updateFiles } = dataStore

const { files, hasWorkDir } = storeToRefs(dataStore)

const checkedFiles = shallowRef<string[]>([])

function handleCheckFile(path: string) {
  if (checkedFiles.value.includes(path)) {
    checkedFiles.value = checkedFiles.value.filter(item => item !== path)
  }
  else {
    checkedFiles.value = [...checkedFiles.value, path]
  }
}

function handleCheckAllFiles(checked: boolean) {
  if (checked) {
    checkedFiles.value = files.value.map(item => item.path)
  }
  else {
    checkedFiles.value = []
  }
}

const isAll = computed(() => checkedFiles.value.length === files.value.length)
const isIndeterminate = computed(() => checkedFiles.value.length > 0 && !isAll.value)

onMounted(() => {
  if (hasWorkDir.value) {
    updateFiles()
  }
})
</script>

<template>
  <Layout>
    <div>
      <div class="px-10 mt-6 flex gap-2 items-center">
        <n-checkbox :checked="isAll" :indeterminate="isIndeterminate" @update:checked="handleCheckAllFiles">
          <span>共 {{ files.length }} 项</span>
        </n-checkbox>
      </div>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-6 gap-y-8 px-10 pt-4 pb-8">
      <div v-for="item in files" :key="item.path" class="p-2 rounded-xl transition hover:bg-accent" :class="{ '!bg-accent-foreground': checkedFiles.includes(item.path) }" @click="handleCheckFile(item.path)">
        <file-card :name="item.name" :src="item.url" />
      </div>
    </div>
  </Layout>
</template>

<style scoped></style>
