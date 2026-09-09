<script setup lang="ts">
import { computed, ref } from 'vue'
import { onKeyStroke, useStorage } from '@vueuse/core'
import { useNav } from '@slidev/client'
import { useRouter } from 'vue-router'

const { currentPage, total, prev, next, currentSlideRoute } = useNav()
const router = useRouter()

const fm = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter || {})

function isTypingTarget(el: EventTarget | null) {
  const t = el as HTMLElement | null
  if (!t) return false
  const tag = t.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (t as any).isContentEditable
}

const isPresenterPath = computed(() => {
  const path = String(router.currentRoute.value.path || '')
  return path.split('/').includes('presenter')
})

function pathFor(target: string | number) {
  const base = isPresenterPath.value ? '/presenter' : ''

  // numeric target
  if (typeof target === 'number') return `${base}/${target}`

  const raw = String(target).trim()
  if (!raw) return `${base}/1`

  // numeric string
  if (/^\d+$/.test(raw)) return `${base}/${raw}`

  // route alias or custom path segment
  const slug = raw.replace(/^\/+/, '')
  return `${base}/${slug}`
}

function navigate(target: string | number) {
  router.push(pathFor(target))
}

const slideId = computed(() => {
  if (!currentSlideRoute.value) return 'Loading...'
  // Prefer Slidev route alias (official), then fall back to any custom keys you used before
  return fm.value.routeAlias || fm.value.alias || fm.value.id || 'None'
})

const decisionHistory = useStorage<any[]>('slidev-decision-history', [])
const isBlackedOut = ref(false)

function toggleBlackout(e?: Event) {
  e?.stopPropagation()
  isBlackedOut.value = !isBlackedOut.value
}

function resetPresentation() {
  decisionHistory.value = []
  navigate(1)
}

function makeDecision(choice: 'yes' | 'no') {
  if (isBlackedOut.value) return
  const rawTarget = choice === 'yes' ? fm.value.yesTarget : fm.value.noTarget
  if (!rawTarget) return

  decisionHistory.value.push({
    slide: currentPage.value,
    label: fm.value.question || 'Decision',
    choice: choice === 'yes' ? 'Y' : 'N',
  })

  navigate(String(rawTarget).trim())
}

function goBack() {
  if (decisionHistory.value.length > 0) {
    const last = decisionHistory.value.pop()
    // last.slide is numeric page; keep it numeric
    navigate(Number(last.slide) || 1)
  } else {
    prev()
  }
}

// Keyboard shortcuts (ignore typing targets)
onKeyStroke(['b', 'B'], (e) => {
  if (isTypingTarget(e.target)) return
  e.preventDefault()
  toggleBlackout()
})

onKeyStroke(['y', 'Y'], (e) => {
  if (isTypingTarget(e.target)) return
  if (fm.value.decision && !isBlackedOut.value) makeDecision('yes')
})

onKeyStroke(['n', 'N'], (e) => {
  if (isTypingTarget(e.target)) return
  if (fm.value.decision && !isBlackedOut.value) makeDecision('no')
})

onKeyStroke(['r', 'R'], (e) => {
  if (isTypingTarget(e.target)) return
  if (!isBlackedOut.value) resetPresentation()
})
</script>

<template>
  <!-- Decision breadcrumbs (history) -->
  <div v-if="decisionHistory.length > 0" class="fixed top-0 left-0 p-3 z-50 flex gap-2 pointer-events-none">
    <div
      v-for="(step, i) in decisionHistory"
      :key="i"
      class="bg-white/80 backdrop-blur border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] flex items-center gap-1"
    >
      <span class="text-gray-400 uppercase tracking-tighter">{{ step.label }}</span>
      <span :class="step.choice === 'Y' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
        {{ step.choice }}
      </span>
    </div>
  </div>

  <!-- Tiny slide indicator (top-right) -->
  <div class="fixed top-0 right-0 p-2 opacity-20 text-[10px] pointer-events-none font-mono flex flex-col items-end">
    <div>Slide: {{ currentPage }} / {{ total }}</div>
    <div>ID: {{ slideId }}</div>
  </div>

  <!-- Bottom-right controls -->
  <div class="fixed bottom-2 right-2 flex items-center gap-6 z-[1000] pointer-events-none">
    <div class="flex items-center gap-4 pointer-events-auto bg-white/80 backdrop-blur p-2 rounded-lg border border-gray-200 shadow-sm">
      <button
        @click.stop="resetPresentation"
        title="Restart (R)"
        class="i-carbon-renew opacity-40 hover:opacity-100 cursor-pointer text-xl"
      />
      <div class="w-[1px] h-6 bg-gray-300 mx-1" />

      <template v-if="fm.decision">
        <button
          @click.stop="goBack"
          title="Back"
          class="i-carbon-arrow-left opacity-40 hover:opacity-100 transition cursor-pointer text-xl"
        />
        <button
          @click.stop="makeDecision('no')"
          class="px-5 py-2 bg-red-100 text-red-800 rounded border border-red-300 text-sm font-bold shadow-sm cursor-pointer active:scale-95 transition flex items-center gap-2"
        >
          <span class="i-carbon-close-outline text-lg" /> NO
        </button>
        <button
          @click.stop="makeDecision('yes')"
          class="px-5 py-2 bg-green-100 text-green-800 rounded border border-green-300 text-sm font-bold shadow-sm cursor-pointer active:scale-95 transition flex items-center gap-2"
        >
          <span class="i-carbon-checkmark-outline text-lg" /> YES
        </button>
      </template>

      <template v-else>
        <button
          @click.stop="toggleBlackout"
          title="Blackout (B)"
          class="i-carbon-asleep opacity-40 hover:opacity-100 cursor-pointer text-xl"
        />
        <button
          v-if="currentPage > 1"
          @click.stop="prev()"
          title="Prev"
          class="i-carbon-arrow-left opacity-40 hover:opacity-100 cursor-pointer text-xl"
        />
        <button
          v-if="currentPage < total"
          @click.stop="next()"
          title="Next"
          class="i-carbon-arrow-right opacity-40 hover:opacity-100 cursor-pointer text-xl"
        />
      </template>
    </div>
  </div>

  <!-- Blackout overlay -->
  <div
    v-if="isBlackedOut"
    @click="toggleBlackout"
    class="fixed inset-0 bg-black z-[2000] flex items-center justify-center cursor-pointer"
  >
    <p class="text-white/30 uppercase tracking-widest text-sm font-bold">Paused</p>
  </div>
</template>
