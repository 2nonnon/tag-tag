<script setup lang="ts">
import { drawerApiInjectionKey } from './context'
import type { DrawerApiInjection, DrawerProps, DrawerReactive } from './type'
import DrawerEnvironment from './DrawerEnvironment.vue'
import { createId } from '@/utils/createId'

const drawerList = reactive<Array<DrawerProps>>([])

const create: DrawerApiInjection['create'] = (props) => {
  const key = createId()

  function destroy() {
    const index = drawerList.findIndex(item => item.key === key)
    drawerList.splice(index, 1)
  }

  const drawerReactive = reactive<DrawerReactive>({ key, destroy, ...props })

  drawerList.push(drawerReactive)

  return drawerReactive
}

provide(drawerApiInjectionKey, { create })
</script>

<template>
  <template v-for="{ key, content, ...props } in drawerList" :key="key">
    <DrawerEnvironment v-bind="props">
      <component :is="content" />
    </DrawerEnvironment>
  </template>

  <slot />
</template>

<style scoped></style>
