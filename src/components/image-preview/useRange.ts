export interface UseRangeOptions {
  min?: number
  max?: number
  step?: number
  inc?: (current: number, step: number) => number
  dec?: (current: number, step: number) => number
}

export function clamp(min: number, num: number, max: number) {
  return Math.min(Math.max(min, num), max)
}

export default function useRange(defaultValue: number = 0, options: UseRangeOptions = {}) {
  const { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, step = 1, inc: $inc, dec: $dec } = options

  const value = ref(defaultValue)

  function inc(delta?: number) {
    return value.value = clamp(min, delta ? (value.value + delta) : $inc?.(value.value, step) ?? (value.value + step), max)
  }

  function dec(delta?: number) {
    return value.value = clamp(min, delta ? (value.value - delta) : $dec?.(value.value, step) ?? (value.value - step), max)
  }

  function get() {
    return value.value
  }

  function set(val: number) {
    return value.value = clamp(min, val, max)
  }

  function reset(val?: number) {
    return value.value = val || defaultValue
  }

  return {
    value,
    inc,
    dec,
    get,
    set,
    reset,
  }
}
