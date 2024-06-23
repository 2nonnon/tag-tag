import { type UseCheckTapOptions, useCheckTap } from './useCheckTap'

export interface UseMouseEventOptions extends UseCheckTapOptions {
  onStart?: (event: MouseEvent) => void
  onDrag?: (event: MouseEvent, delta: { deltaX: number, deltaY: number }) => void
  onEnd?: (event: MouseEvent) => void
}

export default function useMouseEvent(el: HTMLElement, options: UseMouseEventOptions) {
  const { onStart, onDrag, onEnd, onTap, onDoubleTap } = options

  const checkTap = useCheckTap({ onTap, onDoubleTap })

  let tapStartPositionX = 0
  let tapStartPositionY = 0

  let tapEndPositionX = 0
  let tapEndPositionY = 0

  let touchStartTime = 0

  let running = false

  function handleMouseDown(e: MouseEvent) {
    touchStartTime = Date.now()

    const { clientX, clientY } = e

    tapStartPositionX = tapEndPositionX = clientX
    tapStartPositionY = tapEndPositionY = clientY

    onStart?.(e)

    nextTick(() => {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    })
  }

  function handleMouseMove(e: MouseEvent) {
    if (running)
      return
    running = true

    const deltaX = e.clientX - tapStartPositionX
    const deltaY = e.clientY - tapStartPositionY

    tapEndPositionX = e.clientX
    tapEndPositionY = e.clientY

    onDrag?.(e, { deltaX, deltaY })

    nextTick(() => {
      running = false
    })
  }

  function handleMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)

    checkTap({
      deltaX: tapEndPositionX - tapStartPositionX,
      deltaY: tapEndPositionY - tapStartPositionY,
      deltaTime: Date.now() - touchStartTime,
    })

    onEnd?.(e)
  }

  el.addEventListener('mousedown', handleMouseDown)

  function unbind() {
    el.removeEventListener('mousedown', handleMouseDown)
  }

  return unbind
}
