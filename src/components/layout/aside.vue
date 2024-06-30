<script setup lang="ts">
import { ChevronLeft, Settings } from 'lucide-vue-next'
</script>

<template>
  <aside class="w-16 flex-shrink-0 flex-grow-0 bg-gray-100 dark:bg-zinc-500">
    <div class="flex flex-col justify-between items-center h-full py-4">
      <div class="flex flex-col gap-2">
        <n-button quaternary type="primary">
          <template #icon>
            <ChevronLeft />
          </template>
        </n-button>
      </div>

      <div class="flex flex-col gap-2">
        <ColorModeToggle />

        <n-button quaternary type="primary">
          <template #icon>
            <Settings />
          </template>
        </n-button>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
