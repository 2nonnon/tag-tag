<script setup lang="ts">
defineProps<{
  name?: string
  src: string
  checked?: boolean
}>()
</script>

<template>
  <div class="p-2 rounded-xl transition hover:bg-accent" :class="{ '!bg-accent-foreground': checked }">
    <slot />
  </div>
</template>

<style scoped></style>
