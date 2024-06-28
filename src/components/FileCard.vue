<script setup lang="ts">
const props = defineProps<{
  name?: string
  src: string
}>()

const $src = ref('')

const targetRef = ref<HTMLElement | null>(null)

const loading = ref(true)
const error = ref(false)

async function createLoadedImg(src: string) {
  const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>()

  const img = new Image()
  img.src = src
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    resolve(img)
  }
  img.onerror = () => {
    reject()
  }

  return promise
}

async function imageCompress(src: string) {
  const img = await createLoadedImg(src)

  const canvas = document.createElement('canvas')

  const ctx = canvas.getContext('2d')!

  canvas.width = img.width / 2
  canvas.height = img.height / 2

  ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2)

  const { promise, resolve } = Promise.withResolvers<string>()

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob!)
    resolve(url)
  }, 'image/jpeg', 0.5)

  return promise
}

const { stop } = useIntersectionObserver(
  targetRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      stop()

      try {
        const src = await imageCompress(props.src)
        $src.value = src
      }
      catch (e) {
        error.value = true
      }
      finally {
        loading.value = false
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
