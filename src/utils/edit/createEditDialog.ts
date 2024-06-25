import type { VNodeChild } from 'vue'
import { NFlex } from 'naive-ui'
import type { AsyncDialogOptions } from './createAsyncDialog'
import { createAsyncDialog } from './createAsyncDialog'
import BasicForm from '@/components/basic-form/index.vue'
import type { BasicFormItem, FormValue } from '@/components/basic-form/type'

type EditDialogOption<T, D extends FormValue = FormValue> = Readonly<Omit<AsyncDialogOptions<T>, 'content' | 'onPositiveClick' | 'onNegativeClick'> & {
  formItems: BasicFormItem[]
  beforeFormContent?: string | (() => VNodeChild)
  afterFormContent?: string | (() => VNodeChild)
  defaultValue?: Partial<D>
  api: (data: D) => Promise<T>
  onUpdateValue?: (value: D, path?: string, newValue?: any, oldValue?: any) => MaybeEmpty<D> | void
}>

export function createEditDialog<T, D extends FormValue = FormValue>({
  formItems,
  beforeFormContent,
  afterFormContent,
  api,
  defaultValue,
  onUpdateValue,
  ...options
}: EditDialogOption<T, D>) {
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

  return createAsyncDialog({
    positiveText: '确定',
    negativeText: '取消',
    ...options,
    showIcon: false,
    maskClosable: false,
    content() {
      return h(NFlex, { vertical: true }, () => [
        typeof beforeFormContent === 'function' ? beforeFormContent() : beforeFormContent,
        h(BasicFormWithType, { 'ref': formRef, 'items': formItems, defaultValue, 'onUpdate:value': handleUpdateValue as any }),
        typeof afterFormContent === 'function' ? afterFormContent() : afterFormContent,
      ])
    },
    onPositiveClick: async () => {
      const data = await formRef.value!.validate()

      return api(data)
    },
  })
}
