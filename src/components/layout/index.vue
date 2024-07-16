<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Pencil, Plus, RotateCw } from 'lucide-vue-next'
import { useDataStore } from '@/store/data'
import { useStateStore } from '@/store/state'

const dataStore = useDataStore()

const { updateFiles, chooseDir } = dataStore

const { hasWorkDir } = storeToRefs(dataStore)

const { isMaximized } = storeToRefs(useStateStore())
</script>

<template>
  <n-el class="overflow-hidden border border-[--tag-color] flex absolute inset-0 select-none" :class="{ 'rounded-lg': !isMaximized }">
    <Aside />

    <n-layout content-class="h-full flex flex-col">
      <n-layout-header bordered>
        <Header />
      </n-layout-header>

      <n-layout-content class="flex-1" :native-scrollbar="false">
        <main>
          <slot />
        </main>

        <n-back-top :bottom="144" :right="20" :visibility-height="0">
          <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="chooseDir()">
            <n-icon>
              <Pencil v-if="hasWorkDir" />
              <Plus v-else />
            </n-icon>
          </div>
        </n-back-top>

        <n-back-top :bottom="88" :right="20" :visibility-height="0">
          <div class="absolute inset-0 z-1 flex justify-center items-center" @click.stop="updateFiles()">
            <n-icon>
              <RotateCw />
            </n-icon>
          </div>
        </n-back-top>

        <n-back-top :bottom="32" :right="20" :visibility-height="160" />
      </n-layout-content>
    </n-layout>
  </n-el>
</template>
