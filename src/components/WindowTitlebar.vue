<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Minus, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useStateStore } from '@/store/state'

const stateStore = useStateStore()

const { isMaximized } = storeToRefs(stateStore)

const { setIsMaximized } = stateStore

async function toggleMaximize() {
  await appWindow.toggleMaximize()
  setIsMaximized(await appWindow.isMaximized())
}
</script>

<template>
  <div class="flex items-center gap-3">
    <n-button class="w-8 h-8 p-0" quaternary @click="appWindow.minimize()">
      <n-icon>
        <Minus />
      </n-icon>
    </n-button>

    <n-button class="w-8 h-8 p-0" quaternary @click="toggleMaximize">
      <n-icon v-if="isMaximized">
        <Stack />
      </n-icon>
      <n-icon v-else>
        <Square />
      </n-icon>
    </n-button>

    <n-button class="w-8 h-8 p-0" quaternary @click="appWindow.close()">
      <n-icon>
        <X />
      </n-icon>
    </n-button>
  </div>
</template>
