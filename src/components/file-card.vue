<script setup lang="ts">
const props = defineProps<{
  name?: string
  src: string
}>()

const $src = ref('')

onMounted(() => {
  const img = new Image()
  img.src = props.src
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    const canvas = document.createElement('canvas')

    const ctx = canvas.getContext('2d')!

    canvas.width = img.width / 2
    canvas.height = img.height / 2

    ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2)

    canvas.toBlob((blob) => {
      console.log(blob?.size)
      const url = URL.createObjectURL(blob!)
      $src.value = url
    }, 'image/jpeg', 0.5)
  }
})
</script>

<template>
  <div>
    <div class="w-full aspect-square overflow-hidden rounded-md mb-2">
      <img class="h-full w-full object-cover" :src="$src" :alt="name" decoding="async">
    </div>
    <div class="text-ellipsis overflow-hidden font-bold">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
</style>
