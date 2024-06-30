<script setup lang="ts">
import { ChevronLeft, Settings } from 'lucide-vue-next'
</script>

<template>
  <n-el tag="aside" class="w-16 flex-shrink-0 flex-grow-0 bg-[--tag-color]">
    <div class="flex flex-col justify-between items-center h-full py-8">
      <div class="flex flex-col gap-6">
        <n-button text>
          <n-icon>
            <ChevronLeft />
          </n-icon>
        </n-button>
      </div>

      <div class="flex flex-col gap-6">
        <ColorModeToggle />

        <n-button text>
          <n-icon>
            <Settings />
          </n-icon>
        </n-button>
      </div>
    </div>
  </n-el>
</template>

<style scoped></style>
