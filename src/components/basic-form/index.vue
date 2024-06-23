<script setup lang="ts" generic="T extends FormValue, D = MaybeEmpty<T>">
import type { FormInst } from 'naive-ui'
import { NFormItem, NFormItemGi, NGrid } from 'naive-ui'
import type { BasicFormProps, FormValue } from './type'
import useMergedState from '@/composables/useMergedState'

type F = BasicFormProps<T>

const props = withDefaults(
  defineProps<F>(),
  {
    disabled: false,
    xGap: 16,
    span: 24,
    showFeedback: true,
  },
)

const emits = defineEmits<{
  'update:value': [value: D, path?: string, newValue?: any, oldValue?: any]
}>()

const controlledValueRef = toRef(props, 'value') as Ref<FormValue>

const uncontrolledValueRef = ref({ ...props.defaultValue }) as Ref<FormValue>

const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef)

const formRef = ref<FormInst | null>(null)

function handleUpdateValue(path: string, value: any) {
  emits('update:value', { ...mergedValueRef.value, [path]: value } as D, path, value, mergedValueRef.value[path])

  uncontrolledValueRef.value[path] = value
}

function resetFields() {
  Object.keys(uncontrolledValueRef.value).forEach((key) => {
    uncontrolledValueRef.value[key] = null
  })

  emits('update:value', { ...uncontrolledValueRef.value } as D)
}

function getFormValue() {
  return toRaw(mergedValueRef.value) as D
}

function validate() {
  return new Promise<T>((resolve, reject) => {
    formRef.value?.validate((errors) => {
      if (!errors)
        resolve(toRaw(mergedValueRef.value) as T)
      else
        reject(errors)
    })
  })
}

defineExpose(
  {
    setField: handleUpdateValue,
    resetFields,
    validate,
    getFormValue,
  },
)

const Fragment = defineComponent((_, ctx) => {
  return () => h(ctx.slots.default!)
})
</script>

<template>
  <n-form ref="formRef" :model="mergedValueRef" :disabled="disabled" :label-placement="labelPlacement" :label-align="labelAlign" :label-width="labelWidth" :show-feedback="showFeedback" :inline="inline">
    <component :is="inline ? Fragment : NGrid" :cols="cols" :x-gap="xGap" :y-gap="yGap">
      <template v-for="item in items" :key="item.path">
        <component
          :is="inline ? NFormItem : NFormItemGi"
          :show-label="typeof item.showLabel === 'undefined' || item.showLabel"
          :show-feedback="(typeof item.showFeedback === 'undefined' && showFeedback) || item.showFeedback"
          :span="item.span || span"
          :path="item.path"
          :label="item.label"
          :rule="
            item.rule
              ? item.rule
              : typeof item.required === 'boolean' && !item.required
                ? undefined
                : { required: true, message: `${item.label}不可为空` }
          "
        >
          <template v-if="item.labelRender" #label>
            <component :is="item.labelRender" />
          </template>

          <component :is="item.extraRender" v-if="item.type === 'extra'" :data="mergedValueRef" :value="mergedValueRef[item.path]" @update-value="(v:any) => handleUpdateValue(item.path, v)" />

          <n-input
            v-if="item.type === 'input'"
            :value="mergedValueRef[item.path]"
            :type="item.inputType"
            :placeholder="`请输入${item.label}`"
            show-password-on="click"
            clearable
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          >
            <template v-if="item.prefix" #prefix>
              <component :is="item.prefix" :value="mergedValueRef[item.path]" />
            </template>
            <template v-if="item.suffix" #suffix>
              <component :is="item.suffix" :value="mergedValueRef[item.path]" />
            </template>
          </n-input>

          <n-input-number
            v-if="item.type === 'number'"
            :value="mergedValueRef[item.path]"
            class="w-full"
            :precision="item.precision"
            :min="item.min"
            :max="item.max"
            :placeholder="`请输入${item.label}`"
            clearable
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          >
            <template v-if="item.suffix" #suffix>
              {{ item.suffix }}
            </template>
          </n-input-number>

          <n-select
            v-if="item.type === 'select'"
            :value="mergedValueRef[item.path]"
            :placeholder="`请选择${item.label}`"
            :options="item.options"
            :filterable="typeof item.filterable === 'undefined' || item.filterable"
            :multiple="item.multiple"
            :max-tag-count="3"
            clearable
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          />

          <n-cascader
            v-if="item.type === 'cascader'"
            :value="mergedValueRef[item.path]"
            :placeholder="`请选择${item.label}`"
            :options="item.options"
            :max-tag-count="3"
            :show-path="false"
            :filterable="typeof item.filterable === 'undefined' || item.filterable"
            check-strategy="child"
            :multiple="item.multiple"
            clearable
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          />

          <n-date-picker
            v-if="item.type === 'date'"
            :formatted-value="mergedValueRef[item.path]"
            class="w-full"
            :type="item.dateType || 'datetime'"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="item.defaultTime || '00:00:00'"
            :placeholder="`请选择${item.label}`"
            clearable
            :disabled="item.disabled"
            @update:formatted-value="(v:any) => handleUpdateValue(item.path, v)"
          />

          <n-radio-group
            v-if="item.type === 'radio'"
            :value="mergedValueRef[item.path]"
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          >
            <n-flex :vertical="item.vertical">
              <n-radio
                v-for="option in item.options"
                :key="option.value"
                class="items-center"
                :value="option.value"
              >
                <template v-if="item.radioRender">
                  <component :is="item.radioRender" :option="option" />
                </template>
                <template v-else>
                  {{ option.label }}
                </template>
              </n-radio>
            </n-flex>
          </n-radio-group>

          <n-checkbox-group
            v-if="item.type === 'checkbox'"
            :value="mergedValueRef[item.path]"
            :disabled="item.disabled"
            @update:value="(v:any) => handleUpdateValue(item.path, v)"
          >
            <n-flex :vertical="item.vertical">
              <n-checkbox
                v-for="option in item.options"
                :key="option.value"
                class="items-center"
                :value="option.value"
              >
                <template v-if="item.radioRender">
                  <component :is="item.radioRender" :option="option" />
                </template>
                <template v-else>
                  {{ option.label }}
                </template>
              </n-checkbox>
            </n-flex>
          </n-checkbox-group>
        </component>
      </template>

      <slot />
    </component>
  </n-form>
</template>

<style scoped></style>
