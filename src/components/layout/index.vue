<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div>
    <Header />
    <main>
      <slot />
    </main>
  </div>
</template>
