export function deriveRipple(target: HTMLElement) {
  let holding = false
  const ripples: Array<HTMLElement> = []

  target.addEventListener('mousedown', onMouseDown)
  target.addEventListener('mouseup', onMouseUpOrLeave)
  target.addEventListener('mouseleave', onMouseUpOrLeave)

  function destroy() {
    target.removeEventListener('mousedown', onMouseDown)
    target.removeEventListener('mouseup', onMouseUpOrLeave)
    target.removeEventListener('mouseleave', onMouseUpOrLeave)
  }

  function onMouseDown(e: MouseEvent) {
    holding = true

    const { x, y, height, width } = target.getBoundingClientRect()

    const offsetX = e.clientX - x
    const offsetY = e.clientY - y

    const ripple = createRipple({ x: offsetX, y: offsetY, radius: Math.max(height, width) })

    target.appendChild(ripple)
  }

  function onMouseUpOrLeave() {
    holding = false

    ripples.splice(0, ripples.length).forEach(removeRipple)
  }

  function createRipple({ x, y, radius }: { x: number, y: number, radius: number }) {
    const rippleContainer = document.createElement('span')

    rippleContainer.className = 'absolute z-0 inset-0 pointer-events-none overflow-hidden text-inherit'

    rippleContainer.style.cssText = `border-radius: inherit;`

    const rippleElement = document.createElement('span')

    rippleElement.className = 'block absolute rounded-full'

    rippleElement.style.cssText = `top: ${y - radius}px; left: ${x - radius}px; height: ${radius * 2}px; width: ${radius * 2}px; background-color: currentColor; opacity: 0.25;`

    rippleContainer.appendChild(rippleElement)

    rippleElement.animate([{
      opacity: 0,
    }, {
      opacity: 0.25,
    }], {
      duration: 100,
      easing: 'ease-in',
      iterations: 1,
    })

    rippleElement.animate([
      {
        transform: 'scale(0)',
      },
      {
        transform: 'scale(1)',
      },
    ], {
      duration: 250,
      easing: 'ease-in',
      iterations: 1,
    }).addEventListener('finish', () => {
      if (holding)
        ripples.push(rippleContainer)
      else
        removeRipple(rippleContainer)
    })

    return rippleContainer
  }

  function removeRipple(ripple: HTMLElement) {
    ripple.animate([{
      opacity: 1,
    }, {
      opacity: 0,
    }], {
      duration: 150,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      iterations: 1,
    }).addEventListener('finish', () => {
      ripple.remove()
    })
  }

  return destroy
}
