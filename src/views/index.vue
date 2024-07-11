<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { renameFile } from '@tauri-apps/api/fs'
import { useDataStore } from '@/store/data'
import FileCard from '@/components/file-card/FileCard.vue'

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

const options = [
  {
    label: '重命名',
    key: 'rename',
  },
  {
    label: '查看详情',
    key: 'detail',
  },
]

async function rename(path: string) {
  console.log(path)
  await renameFile(path, 'E:\\qianDuan\\0\\wallpaper\\test222_mirur_p_20wwwwwwwwwwwwwwwww8498280649qw8031351_1_2084982806498031351jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjqwejjqwejjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj.jpg')
  updateFiles()
}

const contextPath = ref('')
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

function handleSelect(key: string) {
  showDropdown.value = false

  switch (key) {
    case 'rename': rename(contextPath.value)
      break
    case 'detail':
      break
  }
}

function handleContextMenu(e: MouseEvent, path: string) {
  e.preventDefault()
  contextPath.value = path
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
}

function onClickoutside() {
  showDropdown.value = false
}
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
      <FileCard v-for="item in files" :key="item.path" :name="item.name!" :src="item.url" :checked="checkedFiles.includes(item.path)" @click="handleCheckFile(item.path)" @contextmenu="handleContextMenu($event, item.path)">
        <template #default="{ loading, error, info }">
          <Image :name="item.name!" :src="info?.src" :loading="loading" :error="error" />
          <div class="text-ellipsis font-bold line-clamp-4 [line-break:anywhere]">
            {{ item.name! }}
          </div>
        </template>
      </FileCard>
    </div>

    <div v-if="showDropdown" class="absolute inset-0 z-0" />

    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
  </Layout>
</template>

<style scoped></style>
