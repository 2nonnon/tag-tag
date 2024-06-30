<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
</script>

<template>
  <n-button text @click="toggleDark">
    <n-icon class="dark:hidden">
      <Sun />
    </n-icon>
    <n-icon class="hidden dark:inline">
      <Moon />
    </n-icon>
    <span class="sr-only">Toggle theme</span>
  </n-button>
</template>
