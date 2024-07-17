<script setup lang="ts">
import { renameFile } from '@tauri-apps/api/fs'
import { NButton } from 'naive-ui'
import EditText from './EditText.vue'
import { parseSize, parseTime, parseType } from './helper'
import { setup } from './setup'
import { removeTagFromName } from './tag'
import { createWorker } from '@/utils/worker'

const props = defineProps<{
  path: string
  name: string
  url: string
  checked?: boolean
}>()

interface ImageInfo {
  path: string
  src: string
  url: string
  name: string
  size: number
  width: number
  height: number
  lastModified: number
  blob: Blob
  type: string
}

const info = shallowRef<ImageInfo | null>(null)

const popInfo = computed(() => {
  if (!info.value)
    return null

  return {
    name: removeTagFromName(info.value.name),
    type: parseType(info.value.type),
    size: parseSize(info.value.size),
    width: info.value.width,
    height: info.value.height,
    lastModified: parseTime(info.value.lastModified),
  }
})

const targetRef = ref<HTMLElement | null>(null)

const loading = ref(true)
const error = ref(false)

const { stop } = useIntersectionObserver(
  targetRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()

      const worker = createWorker(setup)
      worker.postMessage({ src: props.url, name: props.name })
      worker.onmessage = (e: { data: Omit<ImageInfo, 'path' | 'src'> }) => {
        const data = e.data
        const url = URL.createObjectURL(data.blob)
        info.value = {
          ...data,
          path: props.path,
          url: props.url,
          src: url,
        }
        loading.value = false
        worker.terminate()
      }
      worker.onerror = () => {
        error.value = true
        loading.value = false
        worker.terminate()
      }
    }
  },
)

const options = [
  {
    label: '重命名',
    key: 'rename',
  },
  {
    label: '标签管理',
    key: 'tag',
  },
]

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

const editing = ref(false)
const message = useMessage()

async function rename(name: string) {
  const currentPath = info.value?.path || props.path

  const segments = currentPath.split('\\')

  const dirname = segments.slice(0, -1).join('\\')
  const filename = segments[segments.length - 1]

  try {
    if (name !== filename) {
      const path = `${dirname}\\${name}`
      await renameFile(currentPath, path)

      info.value = {
        ...info.value!,
        path,
        name,
      }
    }
  }
  catch (e) {
    message.error('修改失败')
  }
  finally {
    editing.value = false
  }
}

const modal = useModal()

async function editTag() {
  const m = modal.create({
    preset: 'card',
    closable: false,
    closeOnEsc: false,
    content() {
      return h('div', {}, [
        h('div', { class: '' }, h('img', { src: props.url })),
        h('div', {}, [
          h('div', {}, []),
          h('div', {}, [
            h(NButton, { onClick: () => m.destroy() }, () => '取消'),
            h(NButton, { type: 'primary', onClick: () => m.destroy() }, () => '确定'),
          ]),
        ]),
      ])
    },
  })
}

function handleSelect(key: string) {
  showDropdown.value = false

  switch (key) {
    case 'rename': editing.value = true
      break
    case 'tag': editTag()
      break
  }
}

async function handleContextMenu(e: MouseEvent) {
  showDropdown.value = false
  await nextTick()
  showDropdown.value = true
  x.value = e.clientX
  y.value = e.clientY
}

function onClickoutside() {
  showDropdown.value = false
}
</script>

<template>
  <div @contextmenu.prevent="handleContextMenu">
    <n-popover trigger="hover" :disabled="!popInfo || editing" :delay="1000">
      <template #trigger>
        <n-el ref="targetRef" class="p-2 rounded-xl transition hover:bg-[--button-color-2-hover]" :class="{ '!bg-[color(from_var(--primary-color-hover)_srgb_r_g_b_/_0.5)]': checked }">
          <slot :loading="loading" :error="error" :info="info" />
          <EditText :value="info?.name || name" :editing="editing" @update:value="rename" />
        </n-el>
      </template>

      <div class="max-w-64">
        <div>{{ popInfo?.name }}</div>
        <div>项目类型：{{ popInfo?.type }}</div>
        <div>分辨率：{{ popInfo?.width }} × {{ popInfo?.height }}</div>
        <div>大小：{{ popInfo?.size }}</div>
        <div>修改时间：{{ popInfo?.lastModified }}</div>
      </div>
    </n-popover>

    <div v-if="showDropdown" class="fixed inset-0 z-0" />

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
  </div>
</template>

<style scoped></style>
