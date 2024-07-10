<script setup lang="ts">
import { parseSize, parseTime, parseType } from './helper'
import { setup } from './setup'
import { createWorker } from '@/utils/worker'

interface ImageInfo {
  path: string
  src: string
  name: string
  size: number
  width: number
  height: number
  lastModified: number
  blob: Blob
  type: string
}

const props = defineProps<{
  name: string
  src: string
  checked?: boolean
}>()

const info = shallowRef<ImageInfo | null>(null)

const popInfo = computed(() => {
  if (!info.value)
    return null

  return {
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
      worker.postMessage({ src: props.src, name: props.name })
      worker.onmessage = (e: { data: Omit<ImageInfo, 'path' | 'src'> }) => {
        const data = e.data
        const url = URL.createObjectURL(data.blob)
        info.value = {
          ...data,
          path: props.src,
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
</script>

<template>
  <n-popover trigger="hover" :disabled="!popInfo" :delay="1000">
    <template #trigger>
      <div ref="targetRef" class="p-2 rounded-xl transition hover:bg-accent" :class="{ '!bg-accent-foreground': checked }">
        <slot :loading="loading" :error="error" :info="info" />
      </div>
    </template>

    <div>
      <div>项目类型：{{ popInfo?.type }}</div>
      <div>分辨率：{{ popInfo?.width }} × {{ popInfo?.height }}</div>
      <div>大小：{{ popInfo?.size }}</div>
      <div>修改时间：{{ popInfo?.lastModified }}</div>
    </div>
  </n-popover>
</template>

<style scoped></style>
