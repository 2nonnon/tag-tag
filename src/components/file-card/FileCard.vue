<script setup lang="ts">
import { createWorker } from '@/utils/worker'

interface ImageInfo {
  path: string
  src: string
  name: string
  size: number
  lastModified: number
  blob: Blob
}

const props = defineProps<{
  name: string
  src: string
  checked?: boolean
}>()

const info = shallowRef<ImageInfo | null>(null)

const targetRef = ref<HTMLElement | null>(null)

const loading = ref(true)
const error = ref(false)

function setup() {
  async function getImageDataByUrl({ src, name }: {
    name: string
    src: string
  }): Promise<{
    imageBitmap: ImageBitmap
    name: string
    size: number
    lastModified: number
  }> {
    const res = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], name)

    return {
      imageBitmap: await createImageBitmap(blob),
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
    }
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
  self.onmessage = async (e: { data: { src: string, name: string } }) => {
    if (e.data.src) {
      try {
        const { imageBitmap, ...imgInfo } = await getImageDataByUrl(e.data)
        const blob = await imageCompress(imageBitmap, 0.5)

        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ blob, ...imgInfo })
      }
      catch (e) {
        // eslint-disable-next-line no-restricted-globals
        self.reportError(e)
      }
    }
  }
}

const { stop } = useIntersectionObserver(
  targetRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()

      const worker = createWorker(setup)
      worker.postMessage({ src: props.src, name: props.name })
      worker.onmessage = (e: { data: { blob: Blob, name: string, size: number, lastModified: number } }) => {
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
  <div ref="targetRef" class="p-2 rounded-xl transition hover:bg-accent" :class="{ '!bg-accent-foreground': checked }">
    <slot :loading="loading" :error="error" :info="info" />
  </div>
</template>

<style scoped></style>
