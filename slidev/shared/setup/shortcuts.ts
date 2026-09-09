import { defineShortcutsSetup } from '@slidev/types'
import type { NavOperations, ShortcutOptions } from '@slidev/types'

declare global {
  interface Window {
    __presenterZoom?: number
    __presenterPanX?: number
    __presenterPanY?: number
    __presenterZoomPanBound?: boolean
    __presenterToggleBound?: boolean
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function emit() {
  window.dispatchEvent(new Event('slidev:presenter-zoompan'))
}

function pathSegments(pathname = location.pathname) {
  return pathname.split('/').filter(Boolean)
}

function isPresenterPath(pathname = location.pathname) {
  return pathSegments(pathname).includes('presenter')
}

function isTypingTarget(el: EventTarget | null) {
  const t = el as HTMLElement | null
  if (!t) return false
  const tag = t.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (t as any).isContentEditable
}

function isTypingNow() {
  return isTypingTarget(document.activeElement)
}

/**
 * Toggle between normal and presenter routes.
 */
function goPresenter(toggle = true) {
  const url = new URL(location.href)
  const segs = pathSegments(url.pathname)

  const slideIdx = segs.findIndex(s => /^\d+$/.test(s))

  if (slideIdx === -1) {
    const base = segs.filter(s => s !== 'presenter')
    const next = toggle && segs.includes('presenter')
      ? [...base]
      : [...base, 'presenter', '1']

    url.pathname = `/${next.join('/')}`
    location.assign(url.toString())
    return
  }

  const isInPresenter = slideIdx > 0 && segs[slideIdx - 1] === 'presenter'
  const base = isInPresenter
    ? segs.slice(0, slideIdx - 1)
    : segs.slice(0, slideIdx)

  const slideNo = segs[slideIdx]

  const next = toggle && isInPresenter
    ? [...base, slideNo]
    : [...base, 'presenter', slideNo]

  url.pathname = `/${next.join('/')}`
  location.assign(url.toString())
}

export default defineShortcutsSetup((_nav: NavOperations, base: ShortcutOptions[]) => {
  /**
   * Presenter zoom & pan
   */
  if (!window.__presenterZoomPanBound) {
    window.__presenterZoomPanBound = true

    window.__presenterZoom ??= 1
    window.__presenterPanX ??= 0
    window.__presenterPanY ??= 0

    const zoomStep = 0.1
    const panStep = 40

    window.addEventListener(
      'keydown',
      (e) => {
        if (!isPresenterPath()) return
        if (isTypingTarget(e.target)) return

        let handled = false

        // Zoom in
        if (e.code === 'Equal') {
          window.__presenterZoom = clamp(window.__presenterZoom + zoomStep, 0.5, 3)
          handled = true
        }

        // Zoom out
        if (e.code === 'Minus') {
          window.__presenterZoom = clamp(window.__presenterZoom - zoomStep, 0.5, 3)
          handled = true
        }

        // Reset
        if (e.code === 'Digit0') {
          window.__presenterZoom = 1
          window.__presenterPanX = 0
          window.__presenterPanY = 0
          handled = true
        }

        // Pan (Shift + Arrows)
        if (e.shiftKey && e.code === 'ArrowLeft') {
          window.__presenterPanX -= panStep
          handled = true
        }
        if (e.shiftKey && e.code === 'ArrowRight') {
          window.__presenterPanX += panStep
          handled = true
        }
        if (e.shiftKey && e.code === 'ArrowUp') {
          window.__presenterPanY -= panStep
          handled = true
        }
        if (e.shiftKey && e.code === 'ArrowDown') {
          window.__presenterPanY += panStep
          handled = true
        }

        if (handled) {
          // 🚨 THIS IS THE CRITICAL FIX
          e.preventDefault()
          e.stopPropagation()
          ;(e as any).stopImmediatePropagation?.()

          emit()
        }
      },
      { capture: true },
    )
  }

  /**
   * Shift+P toggles presenter mode
   */
  if (!window.__presenterToggleBound) {
    window.__presenterToggleBound = true

    window.addEventListener(
      'keydown',
      (e) => {
        if (isTypingTarget(e.target) || isTypingNow()) return
        if (!(e.shiftKey && e.code === 'KeyP')) return

        e.preventDefault()
        goPresenter(true)
      },
      { capture: true },
    )
  }

  // Keep Slidev defaults
  return [...base]
})
