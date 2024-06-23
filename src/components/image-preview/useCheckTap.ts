export interface UseCheckTapOptions {
  onTap?: () => void
  onDoubleTap?: () => void
}

export interface CheckTapOptions {
  deltaX: number
  deltaY: number
  deltaTime: number
}

const TAP_TIME = 250
const TAP_OFFSET = 5

export function useCheckTap(options: UseCheckTapOptions) {
  const { onTap, onDoubleTap } = options

  let doubleTapTimer: NodeJS.Timeout | null = null

  function checkTap(options: CheckTapOptions) {
    const { deltaX, deltaY, deltaTime } = options

    if (
      Math.abs(deltaX) < TAP_OFFSET
      && Math.abs(deltaY) < TAP_OFFSET
      && deltaTime < TAP_TIME
    ) {
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer)
        doubleTapTimer = null
        onDoubleTap?.()
      }
      else {
        doubleTapTimer = setTimeout(() => {
          doubleTapTimer = null
          onTap?.()
        }, TAP_TIME)
      }
    }
  }

  return checkTap
}
