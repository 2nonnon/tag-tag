<script setup lang="ts">
import { getDerivedOffset, isPC, preventDefault } from './helper'
import useMouseEvent from './useMouseEvent'
import useRange from './useRange'
import useTouchEvent from './useTouchEvent'
import useStyle from './useStyle'

const props = defineProps<{
  show: boolean
  src: string
}>()

const emit = defineEmits(['update:show'])

function handleClose() {
  emit('update:show', false)
}

const touchRef = ref<HTMLDivElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)

const { style, setStyle, resetStyle } = useStyle(imgRef, {
  cursor: 'grab',
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scale: 1,
  needTransition: true,
})

function getOffset() {
  return getDerivedOffset({
    containerSize: { width: window.innerWidth, height: window.innerHeight },
    translate: { x: style.translateX, y: style.translateY },
    objectSize: imgRef.value!.getBoundingClientRect(),
  })
}

const { inc: incRotate, dec: decRotate, reset: resetRotate } = useRange(
  style.rotate,
  {
    step: 90,
  },
)

const { get: getScale, inc: incScale, dec: decScale, set: setScale, reset: resetScale } = useRange(
  style.scale,
  {
    min: 0.5,
    max: 2,
    step: 0.2,
    inc: (current, step) => +(current * (1 + step)).toFixed(2),
    dec: (current, step) => +(current * (1 - step)).toFixed(2),
  },
)

function bindTouchEvent() {
  let startTranslateX = style.translateX
  let startTranslateY = style.translateY
  let startScale = getScale()

  return useTouchEvent(touchRef.value!, {
    onStart() {
      startTranslateX = style.translateX
      startTranslateY = style.translateY
      startScale = getScale()
    },
    onDrag(_, { deltaX, deltaY }) {
      setStyle({
        translateX: deltaX + startTranslateX,
        translateY: deltaY + startTranslateY,
        needTransition: false,
      })
    },
    onZoom(_, { start, end }) {
      setStyle({
        scale: setScale(startScale * end / start),
        needTransition: false,
      })
    },
    onEnd() {
      setStyle({
        ...getOffset(),
        needTransition: true,
      })
    },
    onTap() {
      handleClose()
    },
    onDoubleTap() {
      toggleScale()
    },
  })
}

function bindMouseEvent() {
  let startTranslateX = style.translateX
  let startTranslateY = style.translateY

  return useMouseEvent(imgRef.value!, {
    onStart() {
      startTranslateX = style.translateX
      startTranslateY = style.translateY

      setStyle({
        cursor: 'grabbing',
        needTransition: false,
      })
    },
    onDrag(_, { deltaX, deltaY }) {
      setStyle({
        translateX: deltaX + startTranslateX,
        translateY: deltaY + startTranslateY,
        needTransition: false,
      })
    },
    onEnd() {
      setStyle({
        cursor: 'grab',
        ...getOffset(),
        needTransition: true,
      })
    },
    onDoubleTap() {
      toggleScale()
    },
  })
}

let unbindPointerEvent: (() => void) | null = null

watch(
  () => props.show,
  (nv) => {
    if (nv) {
      document.documentElement.style.cssText = 'overflow: hidden;'

      bindWheelEvent()

      nextTick(() => {
        unbindPointerEvent?.()

        unbindPointerEvent = isPC() ? bindMouseEvent() : bindTouchEvent()

        setStyle()
      })
    }
    else {
      document.documentElement.style.cssText = ''

      unbindWheelEvent()

      unbindPointerEvent?.()

      reset()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  unbindWheelEvent()
})

function bindWheelEvent() {
  window.addEventListener('wheel', handleWheel)
}
function unbindWheelEvent() {
  window.removeEventListener('wheel', handleWheel)
}

function handleCloseWishRotate() {
  setStyle({
    rotate: incRotate(),
    needTransition: true,
  })
}

function handleAntiCloseWishRotate() {
  setStyle({
    rotate: decRotate(),
    needTransition: true,
  })
}

function handleZoomIn() {
  setStyle({
    scale: incScale(),
    needTransition: true,
  })
}

async function handleZoomOut() {
  const originalScale = getScale()

  setStyle({
    scale: decScale(),
    needTransition: false,
  })

  const offset = getOffset()

  setStyle({
    scale: setScale(originalScale),
    needTransition: false,
  })

  setStyle({
    scale: decScale(),
    ...offset,
    needTransition: true,
  })
}

function handleWheel(e: WheelEvent) {
  if (e.deltaY < 0)
    handleZoomIn()
  else
    handleZoomOut()
}

function toggleScale() {
  setStyle({
    scale: setScale(getScale() === 1 ? 2 : 1),
    translateX: 0,
    translateY: 0,
    needTransition: true,
  })
}

function handleReset() {
  setStyle({
    scale: resetScale(),
    translateX: 0,
    translateY: 0,
    needTransition: true,
  })
}

function reset() {
  resetRotate()
  resetScale()
  resetStyle()
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[99999]">
    <div class="absolute inset-0 bg-black/30" draggable="false" @click="handleClose" />
    <div
      ref="touchRef"
      draggable="false"
      class="absolute inset-0 overflow-hidden flex pointer-events-none"
    >
      <img
        ref="imgRef"
        draggable="false"
        class="m-auto max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] transition block h-auto w-auto object-contain select-none pointer-events-auto"
        :src="src"
        alt=""
        @dragstart="preventDefault"
      >
    </div>
    <div
      class="absolute z-10 left-1/2 bottom-10 -translate-x-1/2 rounded-full h-12 px-3 bg-black/40 text-white/80 transition flex items-center pointer-events-auto"
    >
      <i
        class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]"
        @click="handleAntiCloseWishRotate"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 12.7916 4.63419 15.2026 7 16.3265V14.5C7 14.2239 7.22386 14 7.5 14C7.77614 14 8 14.2239 8 14.5V17.5C8 17.7761 7.77614 18 7.5 18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H6.12422C3.66539 15.6357 2 13.0128 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 10.2761 17.7761 10.5 17.5 10.5C17.2239 10.5 17 10.2761 17 10Z"
            fill="currentColor"
          />
          <path
            d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12ZM10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z"
            fill="currentColor"
          />
        </svg>
      </i>
      <i
        class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]"
        @click="handleCloseWishRotate"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 12.7916 15.3658 15.2026 13 16.3265V14.5C13 14.2239 12.7761 14 12.5 14C12.2239 14 12 14.2239 12 14.5V17.5C12 17.7761 12.2239 18 12.5 18H15.5C15.7761 18 16 17.7761 16 17.5C16 17.2239 15.7761 17 15.5 17H13.8758C16.3346 15.6357 18 13.0128 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 10.2761 2.22386 10.5 2.5 10.5C2.77614 10.5 3 10.2761 3 10Z"
            fill="currentColor"
          />
          <path
            d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11Z"
            fill="currentColor"
          />
        </svg>
      </i>
      <i class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]" @click="handleReset">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <g fill="none">
            <path
              d="M5.5 4A1.5 1.5 0 0 0 4 5.5v1a.5.5 0 0 1-1 0v-1A2.5 2.5 0 0 1 5.5 3h1a.5.5 0 0 1 0 1h-1zM16 5.5A1.5 1.5 0 0 0 14.5 4h-1a.5.5 0 0 1 0-1h1A2.5 2.5 0 0 1 17 5.5v1a.5.5 0 0 1-1 0v-1zm0 9a1.5 1.5 0 0 1-1.5 1.5h-1a.5.5 0 0 0 0 1h1a2.5 2.5 0 0 0 2.5-2.5v-1a.5.5 0 0 0-1 0v1zm-12 0A1.5 1.5 0 0 0 5.5 16h1.25a.5.5 0 0 1 0 1H5.5A2.5 2.5 0 0 1 3 14.5v-1.25a.5.5 0 0 1 1 0v1.25zM8.5 7A1.5 1.5 0 0 0 7 8.5v3A1.5 1.5 0 0 0 8.5 13h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 11.5 7h-3zM8 8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z"
              fill="currentColor"
            />
          </g>
        </svg>
      </i>
      <i class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]" @click="handleZoomOut">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 8C11.2761 8 11.5 8.22386 11.5 8.5C11.5 8.77614 11.2761 9 11 9H6C5.72386 9 5.5 8.77614 5.5 8.5C5.5 8.22386 5.72386 8 6 8H11Z"
            fill="currentColor"
          />
          <path
            d="M14 8.5C14 5.46243 11.5376 3 8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1464 16.8536L16.2157 16.9114C16.4106 17.0464 16.68 17.0271 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z"
            fill="currentColor"
          />
        </svg>
      </i>
      <i class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]" @click="handleZoomIn">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.5 8.5C11.5 8.22386 11.2761 8 11 8H9V6C9 5.72386 8.77614 5.5 8.5 5.5C8.22386 5.5 8 5.72386 8 6V8H6C5.72386 8 5.5 8.22386 5.5 8.5C5.5 8.77614 5.72386 9 6 9H8V11C8 11.2761 8.22386 11.5 8.5 11.5C8.77614 11.5 9 11.2761 9 11V9H11C11.2761 9 11.5 8.77614 11.5 8.5Z"
            fill="currentColor"
          />
          <path
            d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z"
            fill="currentColor"
          />
        </svg>
      </i>
      <i class="text-3xl p-2 cursor-pointer [&>svg]:h-[1em] [&>svg]:w-[1em]" @click="handleClose">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.089 4.216l.057-.07a.5.5 0 0 1 .638-.057l.07.057L10 9.293l5.146-5.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 .057.638l-.057.07L10.707 10l5.147 5.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057L10 10.707l-5.146 5.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1-.057-.638l.057-.07L9.293 10L4.146 4.854a.5.5 0 0 1-.057-.638l.057-.07l-.057.07z"
            fill="currentColor"
          />
        </svg>
      </i>
    </div>
  </div>
</template>

<style scoped></style>
