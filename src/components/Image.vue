<script setup lang="ts">
interface Props {
  name: string
  src?: string
  loading: boolean
  error: boolean
}

defineProps<Props>()
</script>

<template>
  <div>
    <div class="w-full aspect-square overflow-hidden rounded-md mb-2 transition-transform duration-300">
      <div v-if="loading" class="w-full h-full flex justify-center items-center">
        加载中...
      </div>
      <div v-else-if="error" class="w-full h-full flex justify-center items-center">
        加载失败...
      </div>
      <img v-else class="h-full w-full object-cover" :src="src" :alt="name">
    </div>
  </div>
</template>

<style scoped>
</style>
