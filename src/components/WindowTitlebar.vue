<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Maximize, Minus, X } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center gap-3">
    <n-button class="w-8 h-8 p-0" quaternary @click="appWindow.minimize()">
      <n-icon>
        <Minus />
      </n-icon>
    </n-button>

    <n-button class="w-8 h-8 p-0" quaternary @click="appWindow.toggleMaximize()">
      <n-icon>
        <Maximize />
      </n-icon>
    </n-button>

    <n-button class="w-8 h-8 p-0" quaternary @click="appWindow.close()">
      <n-icon>
        <X />
      </n-icon>
    </n-button>
  </div>
</template>
