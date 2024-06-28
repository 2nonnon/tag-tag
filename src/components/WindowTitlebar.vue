<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Maximize, Minus, X } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center">
    <n-button quaternary type="primary" @click="appWindow.minimize()">
      <template #icon>
        <Minus />
      </template>
    </n-button>

    <n-button quaternary type="primary" @click="appWindow.toggleMaximize()">
      <template #icon>
        <Maximize />
      </template>
    </n-button>

    <n-button quaternary type="primary" @click="appWindow.close()">
      <template #icon>
        <X />
      </template>
    </n-button>
  </div>
</template>
