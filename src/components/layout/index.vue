<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Pencil, Plus, RotateCw } from 'lucide-vue-next'
import { useDataStore } from '@/store/data'

const dataStore = useDataStore()

const { updateFiles, chooseDir } = dataStore

const { hasWorkDir } = storeToRefs(dataStore)
</script>

<template>
  <div class="rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-500 flex absolute inset-0">
    <Aside />

    <n-layout content-class="h-full flex flex-col" embedded>
      <n-layout-header bordered>
        <Header />
      </n-layout-header>

      <n-layout-content class="flex-1" :native-scrollbar="false">
        <main>
          <slot />
        </main>

        <n-back-top :bottom="160" :right="20" :visibility-height="0">
          <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="chooseDir()">
            <n-icon class="n-base-icon">
              <Pencil v-if="hasWorkDir" icon="iconamoon:edit" />
              <Plus v-else />
            </n-icon>
          </div>
        </n-back-top>

        <n-back-top :bottom="100" :right="20" :visibility-height="0">
          <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="updateFiles()">
            <n-icon class="n-base-icon">
              <RotateCw />
            </n-icon>
          </div>
        </n-back-top>

        <n-back-top :right="20" :visibility-height="160" />
      </n-layout-content>
    </n-layout>
  </div>
</template>
