import { getDistance, preventDefault } from './helper'
import { type UseCheckTapOptions, useCheckTap } from './useCheckTap'

export interface UseTouchEventOptions extends UseCheckTapOptions {
  onStart?: (event: TouchEvent) => void
  onDrag?: (event: TouchEvent, delta: { deltaX: number, deltaY: number }) => void
  onZoom?: (event: TouchEvent, distance: { start: number, end: number }) => void
  onEnd?: (event: TouchEvent) => void
}

export default function useTouchEvent(el: HTMLElement, options: UseTouchEventOptions) {
  const { onStart, onDrag, onZoom, onEnd, onTap, onDoubleTap } = options

  const checkTap = useCheckTap({ onTap, onDoubleTap })

  let tapStartPositionX = 0
  let tapStartPositionY = 0

  let tapEndPositionX = 0
  let tapEndPositionY = 0

  let fingerNum = 0

  let touchStartTime = 0

  let running = false

  let dragging = false
  let zooming = false

  let startDistance = 0

  function onTouchStart(event: TouchEvent) {
    const { touches } = event

    tapStartPositionX = tapEndPositionX = event.touches[0].clientX
    tapStartPositionY = tapEndPositionY = event.touches[0].clientY

    touchStartTime = Date.now()

    fingerNum = touches.length
    dragging = fingerNum === 1
    zooming = fingerNum === 2

    if (zooming)
      startDistance = getDistance(event.touches)

    onStart?.(event)
  }

  function onTouchMove(event: TouchEvent) {
    if (running)
      return
    running = true

    const { touches } = event

    const touch = touches[0]

    const deltaX = touch.clientX - tapStartPositionX
    const deltaY = touch.clientY - tapStartPositionY

    tapEndPositionX = touch.clientX
    tapEndPositionY = touch.clientY

    if (dragging || zooming)
      preventDefault(event, true)

    if (dragging)
      onDrag?.(event, { deltaX, deltaY })

    if (zooming && touches.length === 2) {
      const distance = getDistance(touches)

      onZoom?.(event, { start: startDistance, end: distance })
    }

    nextTick(() => {
      running = false
    })
  }

  function onTouchEnd(event: TouchEvent) {
    let stopPropagation = false

    if (dragging || zooming) {
      stopPropagation = true

      if (dragging && tapStartPositionX === tapEndPositionX && tapStartPositionY === tapEndPositionY)
        stopPropagation = false

      if (!event.touches.length) {
        if (dragging)
          dragging = false

        if (zooming)
          zooming = false
      }
    }

    // eliminate tap delay on safari
    preventDefault(event, stopPropagation)

    if (fingerNum <= 1) {
      checkTap({
        deltaX: tapEndPositionX - tapStartPositionX,
        deltaY: tapEndPositionY - tapStartPositionY,
        deltaTime: Date.now() - touchStartTime,
      })
    }

    onEnd?.(event)
  }

  el.addEventListener('touchstart', onTouchStart)
  el.addEventListener('touchmove', onTouchMove)
  el.addEventListener('touchend', onTouchEnd)
  el.addEventListener('touchcancel', onTouchEnd)

  function unbind() {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
    el.removeEventListener('touchcancel', onTouchEnd)
  }

  return unbind
}
