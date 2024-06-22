<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div data-tauri-drag-region class="flex justify-between items-center px-6 py-2">
    <div>TagTag</div>

    <div class="flex items-center gap-2">
      <ColorModeToggle />
      <WindowTitlebar />
    </div>
  </div>
</template>
