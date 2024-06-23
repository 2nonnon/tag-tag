import type { VNodeChild } from 'vue'
import { NFlex } from 'naive-ui'
import type { AsyncDrawerOptions } from './createAsyncDrawer'
import { createAsyncDrawer } from './createAsyncDrawer'
import BasicForm from '@/components/basic-form/index.vue'
import type { BasicFormItem, FormValue } from '@/components/basic-form/type'

export type EditDrawerOptions<T, D extends FormValue = FormValue> = Readonly<Omit<AsyncDrawerOptions<T>, 'content' | 'onPositiveClick' | 'onNegativeClick'> & {
  formItems: BasicFormItem[]
  beforeFormContent?: string | (() => VNodeChild)
  afterFormContent?: string | (() => VNodeChild)
  defaultValue?: Partial<D>
  api: (data: D) => Promise<T>
  onUpdateValue?: (value: D, path?: string, newValue?: any, oldValue?: any) => MaybeEmpty<D> | void
}>

export function createEditDrawer<T, D extends FormValue = FormValue>({
  formItems,
  beforeFormContent,
  afterFormContent,
  api,
  defaultValue,
  onUpdateValue,
  ...options
}: EditDrawerOptions<T, D>) {
  const BasicFormWithType = BasicForm<D>

  const formRef = ref<ComponentsExposed<typeof BasicFormWithType> | null>(null)

  function handleUpdateValue(value: D, path?: string, newValue?: any, oldValue?: any) {
    const fields = onUpdateValue?.(value, path, newValue, oldValue)
    if (fields) {
      Object.entries(fields).forEach(([key, value]) => {
        formRef.value?.setField(key, value)
      })
    }
  }

  return createAsyncDrawer({
    ...options,
    content() {
      return h(NFlex, { vertical: true }, () => [
        typeof beforeFormContent === 'function' ? beforeFormContent() : beforeFormContent,
        h(BasicFormWithType, { 'ref': formRef, 'items': formItems, defaultValue, 'onUpdate:value': handleUpdateValue }),
        typeof afterFormContent === 'function' ? afterFormContent() : afterFormContent,
      ])
    },
    onPositiveClick: async () => {
      const data = await formRef.value!.validate()

      return api(data)
    },
  })
}
