/**
 * This file provides fallback implementations for problematic ESM modules
 * It helps resolve issues with @floating-ui/core and other ESM dependencies
 */

// Simple positioning utility as a fallback for @floating-ui
export function computePosition(reference: Element, floating: HTMLElement, options: any = {}) {
  const referenceRect = reference.getBoundingClientRect()
  const { placement = "bottom", strategy = "absolute" } = options

  // Default offset
  const offset = options.offset || 5

  // Calculate position based on placement
  let top = 0
  let left = 0

  switch (placement) {
    case "top":
      top = referenceRect.top - floating.offsetHeight - offset
      left = referenceRect.left + (referenceRect.width - floating.offsetWidth) / 2
      break
    case "bottom":
      top = referenceRect.bottom + offset
      left = referenceRect.left + (referenceRect.width - floating.offsetWidth) / 2
      break
    case "left":
      top = referenceRect.top + (referenceRect.height - floating.offsetHeight) / 2
      left = referenceRect.left - floating.offsetWidth - offset
      break
    case "right":
      top = referenceRect.top + (referenceRect.height - floating.offsetHeight) / 2
      left = referenceRect.right + offset
      break
  }

  // Apply position
  floating.style.position = strategy
  floating.style.top = `${top}px`
  floating.style.left = `${left}px`

  return {
    x: left,
    y: top,
    placement,
    strategy,
  }
}

// Export other utilities as needed
export const autoUpdate = (reference: Element, floating: HTMLElement, update: () => void) => {
  // Simple implementation that updates on window resize
  const handleResize = () => {
    update()
  }

  window.addEventListener("resize", handleResize)

  // Return cleanup function
  return () => {
    window.removeEventListener("resize", handleResize)
  }
}
