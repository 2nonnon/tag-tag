<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex items-center">
    <n-button quaternary type="primary" @click="appWindow.minimize()">
      <template #icon>
        <Icon icon="mdi:window-minimize" />
      </template>
    </n-button>

    <n-button quaternary type="primary" @click="appWindow.toggleMaximize()">
      <template #icon>
        <Icon icon="mdi:window-maximize" />
      </template>
    </n-button>

    <n-button quaternary type="primary" @click="appWindow.close()">
      <template #icon>
        <Icon icon="mdi:close" />
      </template>
    </n-button>
  </div>
</template>
