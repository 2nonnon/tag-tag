export interface UseStyleOptions {
  cursor: string
  translateX: number
  translateY: number
  rotate: number
  scale: number
  needTransition: boolean
}

export default function useStyle(el: Ref<HTMLElement | null>, options: UseStyleOptions) {
  const style = { ...options }

  function setStyle(options?: Partial<UseStyleOptions>) {
    if (!el.value)
      return

    Object.assign(style, options)

    const { cursor, translateX, translateY, rotate, scale, needTransition } = style

    el.value.style.cssText = `
      cursor: ${cursor};
      transform-origin: center center;
      transform: translateX(${translateX}px)
                translateY(${translateY}px)
                rotate(${rotate}deg)
                scale(${scale});
      ${needTransition ? '' : 'transition: none;'}
    `

    if (!needTransition)
      void el.value.offsetHeight
  }

  function resetStyle() {
    setStyle(options)
  }

  return {
    style,
    setStyle,
    resetStyle,
  }
}
