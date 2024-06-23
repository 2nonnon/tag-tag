<script setup lang="ts">
import type { DrawerDefineProps } from './type'

const props = withDefaults(
  defineProps<DrawerDefineProps>(),
  {
    title: '编辑',
    width: '500px',
    positiveText: '保存',
    negativeText: '取消',
    closable: true,
    maskClosable: true,
    closeOnEsc: true,
    loading: false,
  },
)

const active = ref(false)

async function $onPositiveClick(e: MouseEvent) {
  const res = await props.onPositiveClick?.(e)

  if (res !== false)
    close()
}

async function $onNegativeClick(e: MouseEvent) {
  const res = await props.onNegativeClick?.(e)

  if (res !== false)
    close()
}

async function $onClose(value: boolean) {
  if (!value) {
    const res = await props.onClose?.()

    if (res === false)
      open()
  }
}

function $onAfterLeave() {
  props.onAfterLeave?.()

  props.destroy()
}

function open() {
  active.value = true
}

function close() {
  active.value = false
}

defineExpose({
  open,
  close,
})

onMounted(() => {
  open()
})
</script>

<template>
  <n-drawer v-model:show="active" :width="width" :close-on-esc="closeOnEsc" :mask-closable="maskClosable" @after-enter="onAfterEnter" @after-leave="$onAfterLeave" @update:show="$onClose" @mask-click="onMaskClick" @esc="onEsc">
    <n-drawer-content :title="title" :closable="closable" :native-scrollbar="false">
      <slot />

      <template #footer>
        <n-flex justify="end">
          <n-button @click="$onNegativeClick">
            {{ negativeText }}
          </n-button>
          <n-button :loading="loading" @click="$onPositiveClick">
            {{ positiveText }}
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped></style>
