<script setup lang="ts">
import { createWorker } from '@/utils/worker'

const props = defineProps<{
  name?: string
  src: string
}>()

const $src = ref('')

const targetRef = ref<HTMLElement | null>(null)

const loading = ref(true)
const error = ref(false)

function setup() {
  async function createImageBitmapByUrl(url: string): Promise<ImageBitmap> {
    const res = await fetch(url)
    const blob = await res.blob()
    return createImageBitmap(blob)
  }

  async function imageCompress(
    img: Exclude<CanvasImageSource, VideoFrame>,
    quality: number,
  ): Promise<Blob> {
    const dataWidth = +img.width
    const dataHeight = +img.height
    const width = dataWidth * quality
    const height = dataHeight * quality
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)
    return await canvas.convertToBlob({ type: 'image/jpeg', quality })
  }

  // eslint-disable-next-line no-restricted-globals
  self.onmessage = async (e: any) => {
    if (e.data.src) {
      const img = await createImageBitmapByUrl(e.data.src)
      const blob = await imageCompress(img, 0.5)

      // eslint-disable-next-line no-restricted-globals
      self.postMessage({ blob })
    }
  }
}

const { stop } = useIntersectionObserver(
  targetRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()

      const worker = createWorker(setup)
      worker.postMessage({ src: props.src! })
      worker.onmessage = (e) => {
        const blob = e.data.blob
        const url = URL.createObjectURL(blob)
        $src.value = url
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
  <div ref="targetRef">
    <div class="w-full aspect-square overflow-hidden rounded-md mb-2">
      <div v-if="loading" class="w-full h-full flex justify-center items-center">
        加载中...
      </div>
      <div v-else-if="error" class="w-full h-full flex justify-center items-center">
        加载失败...
      </div>
      <img v-else class="h-full w-full object-cover" :src="$src" :alt="name">
    </div>
    <div class="text-ellipsis overflow-hidden font-bold">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
</style>
