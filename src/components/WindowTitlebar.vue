<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <Button variant="ghost" size="icon" @click="appWindow.minimize()">
      <Icon icon="mdi:window-minimize" />
    </Button>
    <Button variant="ghost" size="icon" @click="appWindow.toggleMaximize()">
      <Icon icon="mdi:window-maximize" />
    </Button>
    <Button variant="ghost" size="icon" @click="appWindow.close()">
      <Icon icon="mdi:close" />
    </Button>
  </div>
</template>
