export function stopPropagation(event: Event) {
  event.stopPropagation()
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable)
    event.preventDefault()

  if (isStopPropagation)
    stopPropagation(event)
}

export function getDistance(touches: TouchList) {
  return Math.sqrt(
    (touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2,
  )
}

export interface DerivedOffsetData {
  containerSize: { width: number, height: number }
  translate: { x: number, y: number }
  objectSize: { width: number, height: number, top: number, left: number }
}

export function getDerivedOffset({ containerSize, translate, objectSize }: DerivedOffsetData) {
  const { height, width, top, left } = objectSize

  const { height: innerHeight, width: innerWidth } = containerSize

  const distanceToTop = top
  const distanceToLeft = left
  const distanceToBottom = innerHeight - (top + height)
  const distanceToRight = innerWidth - (left + width)

  let { x: translateX, y: translateY } = translate

  if (height <= innerHeight) {
    translateY = 0
  }
  else {
    if (distanceToTop >= 0 && distanceToBottom >= 0) {
      translateY = 0
    }
    else if (distanceToTop * distanceToBottom < 0) {
      if (distanceToTop > 0)
        translateY -= distanceToTop
      else translateY += distanceToBottom
    }
  }

  if (width <= innerWidth) {
    translateX = 0
  }
  else {
    if (distanceToLeft >= 0 && distanceToRight >= 0) {
      translateX = 0
    }
    else if (distanceToLeft * distanceToRight < 0) {
      if (distanceToLeft > 0)
        translateX -= distanceToLeft
      else translateX += distanceToRight
    }
  }

  return { translateX, translateY }
}

export function isPC() {
  return !navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|Opera Mini)/i)
}
