<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { NTag } from 'naive-ui'
import { addTagToName, getTagFromName } from './tag'

const props = defineProps<{
  url: string
  name: string
}>()

defineEmits<{
  cancel: []
  confirm: [name: string]
}>()

const tags = ref(getTagFromName(props.name))

function renderTag(tag: string, index: number) {
  return h(
    NTag,
    {
      type: index < 3 ? 'success' : 'error',
      closable: true,
      onClose: () => {
        tags.value = tags.value.toSpliced(index, 1)
      },
    },
    {
      default: () => tag,
    },
  )
}
</script>

<template>
  <div class="flex gap-4">
    <div class="aspect-square flex-1 rounded overflow-hidden">
      <img class="object-cover w-full h-full" :src="url" alt="">
    </div>

    <div class="w-1/2 flex-shrink-0 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-x-hidden overflow-y-auto p-2">
        <n-dynamic-tags v-model:value="tags" :render-tag="renderTag">
          <template #input="{ submit, deactivate }">
            <n-select
              placeholder="请选择或输入"
              size="small"
              filterable tag :options="[]" autofocus
              @update:value="submit($event)" @blur="deactivate"
            />
          </template>
          <template #trigger="{ activate, disabled }">
            <n-button
              size="small"
              type="primary"
              dashed
              :disabled="disabled"
              @click="activate()"
            >
              <template #icon>
                <n-icon class="text-base">
                  <Plus />
                </n-icon>
              </template>
              添加
            </n-button>
          </template>
        </n-dynamic-tags>
      </div>
      <div class="flex gap-4 justify-end">
        <n-button @click="$emit('cancel')">
          取消
        </n-button>
        <n-button type="primary" @click="$emit('confirm', addTagToName(name, tags))">
          确定
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
