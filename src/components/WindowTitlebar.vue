<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div data-tauri-drag-region class="titlebar">
    <Button variant="outline" size="icon" @click="appWindow.minimize()">
      <Icon icon="mdi:window-minimize" />
    </Button>
    <Button variant="outline" size="icon" @click="appWindow.toggleMaximize()">
      <Icon icon="mdi:window-maximize" />
    </Button>
    <Button variant="outline" size="icon" @click="appWindow.close()">
      <Icon icon="mdi:close" />
    </Button>
  </div>
</template>
