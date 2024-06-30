<script setup lang="ts">

</script>

<template>
  <div data-tauri-drag-region class="flex justify-between items-center px-8 py-4">
    <div class="flex items-center">
      <n-el class="w-[100px] h-[40px] text-[--primary-color]">
        <Logo class="w-full h-full" />
      </n-el>
    </div>

    <div class="flex items-center">
      <WindowTitlebar />
    </div>
  </div>
</template>
