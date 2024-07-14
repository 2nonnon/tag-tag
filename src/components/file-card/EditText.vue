<script setup lang="ts">
import { NInput } from 'naive-ui'

const props = defineProps<{
  value?: string
  editing: boolean
}>()

const emit = defineEmits(['update:value'])

const uncontrolledValue = ref(props.value)

function commitChange(value?: string) {
  emit('update:value', value)
}

watch(() => props.value, () => uncontrolledValue.value = props.value)

const inputRef = ref<InstanceType<typeof NInput> | null>(null)

watch(() => props.editing, async () => {
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
})
</script>

<template>
  <div>
    <div v-if="!editing" class="text-ellipsis font-bold line-clamp-4 [line-break:anywhere]">
      {{ value }}
    </div>
    <NInput
      v-else
      ref="inputRef"
      v-model:value="uncontrolledValue"
      size="small"
      type="textarea"
      :autosize="{ minRows: 1, maxRows: 4 }"
      @blur="commitChange(uncontrolledValue)"
      @enter="commitChange(uncontrolledValue)"
      @click.stop
    />
  </div>
</template>

<style scoped></style>
