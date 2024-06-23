import type { CascaderOption, FormItemRule } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { VNodeChild } from 'vue'
import type { LabelAlign, LabelPlacement } from 'naive-ui/es/form/src/interface'
import type { DatePickerType } from 'naive-ui/es/date-picker/src/config'
import type { DefaultTime } from 'naive-ui/es/date-picker/src/interface'

export interface FormValue {
  [key: string]: any
}

export interface RadioOption {
  label?: string
  value: string | number
  [k: string]: unknown
}

export type SelectOption = SelectMixedOption

export type BasicFormItem = (
  | {
    type: 'input'
    inputType?: 'text' | 'textarea' | 'password'
    prefix?: (data: { value: string }) => VNodeChild
    suffix?: (data: { value: string }) => VNodeChild
  }
  | {
    type: 'date'
    dateType?: DatePickerType
    defaultTime?: DefaultTime
  }
  | {
    type: 'select'
    options: Array<SelectOption>
    filterable?: boolean
    multiple?: boolean
  }
  | {
    type: 'number'
    precision?: number
    min?: number
    max?: number
    suffix?: string
  }
  | {
    type: 'radio' | 'checkbox'
    vertical?: boolean
    options: Array<RadioOption>
    radioRender?: (data: { option: RadioOption }) => VNodeChild
  }
  | {
    type: 'cascader'
    options: CascaderOption[]
    multiple?: boolean
    filterable?: boolean
  }
  | {
    type: 'upload'
    accept?: string
  }
  | {
    type: 'extra'
    extraRender: (data: {
      data: FormValue
      value: any
      onUpdateValue: (value: any) => void
    }) => VNodeChild
  }
) & {
  label?: string
  labelRender?: () => VNodeChild
  showLabel?: boolean
  showFeedback?: boolean
  path: string
  required?: boolean
  rule?: FormItemRule
  span?: string | number
  disabled?: boolean
}

export interface BasicFormProps<T extends FormValue = FormValue, D = MaybeEmpty<T>> {
  value?: T
  defaultValue?: D
  items: BasicFormItem[]
  disabled?: boolean
  labelWidth?: string | number
  labelAlign?: LabelAlign
  labelPlacement?: LabelPlacement
  showFeedback?: boolean
  inline?: boolean
  cols?: string | number
  xGap?: string | number
  yGap?: string | number
  span?: string | number
}
