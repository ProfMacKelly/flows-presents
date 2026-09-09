<!-- components/PresenterZoom.vue -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNav } from '@slidev/client'

const { isPresenter } = useNav()

type ZoomState = { zoom: number; panX: number; panY: number }

function readState(): ZoomState {
  return {
    zoom: (window as any).__presenterZoom ?? 1,
    panX: (window as any).__presenterPanX ?? 0,
    panY: (window as any).__presenterPanY ?? 0,
  }
}

function writeState(next: ZoomState) {
  ;(window as any).__presenterZoom = next.zoom
  ;(window as any).__presenterPanX = next.panX
  ;(window as any).__presenterPanY = next.panY
  window.dispatchEvent(new CustomEvent('slidev:presenter-zoompan'))
}

function isTypingTarget(el: EventTarget | null) {
  const t = el as HTMLElement | null
  if (!t) return false
  const tag = t.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (t as any).isContentEditable
}

const state = ref<ZoomState>(readState())

function onZoomPanEvent() {
  state.value = readState()
}

function clampZoom(z: number) {
  return Math.max(0.2, Math.min(5, z))
}

function onKeyDown(e: KeyboardEvent) {
  if (!isPresenter.value) return

  // If you WANT pan to work even while typing in presenter notes,
  // comment this out. Keeping it here is safer.
  // (If your issue is "notes textarea steals Shift+Arrow", then comment it out.)
  // if (isTypingTarget(e.target)) return

  const cur = readState()

  // Zoom
  if (e.key === '+' || e.key === '=') {
    e.preventDefault()
    writeState({ ...cur, zoom: clampZoom(cur.zoom + 0.1) })
    return
  }
  if (e.key === '-' || e.key === '_') {
    e.preventDefault()
    writeState({ ...cur, zoom: clampZoom(cur.zoom - 0.1) })
    return
  }
  if (e.key === '0') {
    e.preventDefault()
    writeState({ zoom: 1, panX: 0, panY: 0 })
    return
  }

  // Pan (Shift + Arrows)
  if (e.shiftKey && e.key.startsWith('Arrow')) {
    e.preventDefault()

    const step = 30
    let { panX, panY } = cur
    if (e.key === 'ArrowLeft') panX -= step
    if (e.key === 'ArrowRight') panX += step
    if (e.key === 'ArrowUp') panY -= step
    if (e.key === 'ArrowDown') panY += step

    writeState({ ...cur, panX, panY })
  }
}

onMounted(() => {
  // initialize if absent
  const cur = readState()
  writeState(cur)

  window.addEventListener('slidev:presenter-zoompan', onZoomPanEvent as any)
  // Capture phase is key: it runs even when focus is inside presenter UI controls.
  window.addEventListener('keydown', onKeyDown, { capture: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('slidev:presenter-zoompan', onZoomPanEvent as any)
  window.removeEventListener('keydown', onKeyDown, true as any)
})

const styleObj = computed(() => {
  const { zoom, panX, panY } = state.value
  return {
    transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
  } as Record<string, string>
})
</script>

<template>
  <div class="relative w-full h-full overflow-visible">
    <div
      v-if="isPresenter"
      class="fixed right-0 top-0 z-50 rounded px-1 py-1 text-xs bg-black/60 text-white select-none pointer-events-none"
    >
      <span class="ml-0 opacity-80">(+/- , Shift+Arrows, 0)</span>
    </div>

    <div class="origin-top-left inline-block overflow-visible" :style="styleObj">
      <slot />
    </div>
  </div>
</template>
