// Define the options interface for computePosition
interface ComputePositionOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  strategy?: 'absolute' | 'fixed';
  offset?: number;
  rtl?: boolean;
  arrowElement?: HTMLElement | null;
}

// Define the return type for computePosition
interface ComputePositionResult {
  x: number;
  y: number;
  placement: string;
  strategy: string;
}

// Enhanced fallback for positioning UI elements
export function computePosition(
  reference: HTMLElement,
  floating: HTMLElement,
  options: ComputePositionOptions = {}
): ComputePositionResult {
  const referenceRect = reference.getBoundingClientRect();
  const {
    placement = 'bottom',
    strategy = 'absolute',
    offset = 5,
    rtl = false,
    arrowElement = null,
  } = options;

  const floatingRect = floating.getBoundingClientRect();
  let top = 0,
    left = 0,
    finalPlacement = placement;

  const fits: Record<'top' | 'bottom' | 'left' | 'right', boolean> = {
    top: referenceRect.top >= floatingRect.height + offset,
    bottom:
      window.innerHeight - referenceRect.bottom >= floatingRect.height + offset,
    left: referenceRect.left >= floatingRect.width + offset,
    right:
      window.innerWidth - referenceRect.right >= floatingRect.width + offset,
  };

  // Auto-flip if space is not available
  const flipOrder: Record<'top' | 'bottom' | 'left' | 'right', Array<'top' | 'bottom' | 'left' | 'right'>> = {
    top: ['bottom', 'right', 'left'],
    bottom: ['top', 'right', 'left'],
    left: ['right', 'top', 'bottom'],
    right: ['left', 'top', 'bottom'],
  };

  if (!fits[placement]) {
    for (const alt of flipOrder[placement]) {
      if (fits[alt]) {
        finalPlacement = alt;
        break;
      }
    }
  }

  switch (finalPlacement) {
    case 'top':
      top = referenceRect.top - floating.offsetHeight - offset;
      left =
        referenceRect.left + (referenceRect.width - floating.offsetWidth) / 2;
      break;
    case 'bottom':
      top = referenceRect.bottom + offset;
      left =
        referenceRect.left + (referenceRect.width - floating.offsetWidth) / 2;
      break;
    case 'left':
      top =
        referenceRect.top + (referenceRect.height - floating.offsetHeight) / 2;
      left = referenceRect.left - floating.offsetWidth - offset;
      break;
    case 'right':
      top =
        referenceRect.top + (referenceRect.height - floating.offsetHeight) / 2;
      left = referenceRect.right + offset;
      break;
  }

  // RTL support
  if ((finalPlacement === 'left' || finalPlacement === 'right') && rtl) {
    left =
      finalPlacement === 'left'
        ? referenceRect.right + offset
        : referenceRect.left - floating.offsetWidth - offset;
  }

  // Apply styles
  floating.style.position = strategy;
  floating.style.top = `${Math.max(0, top)}px`;
  floating.style.left = `${Math.max(0, left)}px`;

  // Arrow positioning
  if (arrowElement) {
    const arrowSize = arrowElement.offsetWidth;
    switch (finalPlacement) {
      case 'top':
      case 'bottom':
        arrowElement.style.left = `${(floating.offsetWidth - arrowSize) / 2}px`;
        arrowElement.style.top =
          finalPlacement === 'top'
            ? `${floating.offsetHeight - 1}px`
            : `-${arrowSize - 1}px`;
        break;
      case 'left':
      case 'right':
        arrowElement.style.top = `${(floating.offsetHeight - arrowSize) / 2}px`;
        arrowElement.style.left =
          finalPlacement === 'left'
            ? `${floating.offsetWidth - 1}px`
            : `-${arrowSize - 1}px`;
        break;
    }
  }

  return {
    x: left,
    y: top,
    placement: finalPlacement,
    strategy,
  };
}

// Auto-update function with proper typings
export function autoUpdate(
  reference: HTMLElement,
  floating: HTMLElement,
  update: () => void
): () => void {
  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  const handleResizeScroll = () => update();

  window.addEventListener('resize', handleResizeScroll);
  window.addEventListener('scroll', handleResizeScroll, true);

  return () => {
    window.removeEventListener('resize', handleResizeScroll);
    window.removeEventListener('scroll', handleResizeScroll, true);
    observer.disconnect();
  };
}
