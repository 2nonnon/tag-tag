<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/data'

const dataStore = useDataStore()

const { updateFiles, chooseDir } = dataStore

const { hasWorkDir } = storeToRefs(dataStore)
</script>

<template>
  <n-layout content-class="h-full flex flex-col" position="absolute" embedded>
    <n-layout-header bordered>
      <Header />
    </n-layout-header>
    <n-layout-content class="flex-1" :native-scrollbar="true">
      <main>
        <slot />
      </main>

      <n-back-top :bottom="160" :right="24" :visibility-height="0">
        <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="chooseDir()">
          <n-icon class="n-base-icon">
            <Icon v-if="hasWorkDir" icon="iconamoon:edit" />
            <Icon v-else icon="mingcute:add-fill" />
          </n-icon>
        </div>
      </n-back-top>

      <n-back-top :bottom="100" :right="24" :visibility-height="0">
        <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="updateFiles()">
          <n-icon class="n-base-icon">
            <Icon icon="material-symbols:refresh-rounded" />
          </n-icon>
        </div>
      </n-back-top>

      <n-back-top :right="24" :visibility-height="0" />
    </n-layout-content>
  </n-layout>
</template>
