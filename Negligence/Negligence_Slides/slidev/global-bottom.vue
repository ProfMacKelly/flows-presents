<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { onKeyStroke, useStorage } from '@vueuse/core'
import { useNav } from '@slidev/client'
import { useRouter } from 'vue-router'

const { currentPage, total, prev, next, currentSlideRoute } = useNav()
const router = useRouter()

const fm = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter || {})

const slideId = computed(() => {
  if (!currentSlideRoute.value) return 'Loading...'
  return fm.value.alias || fm.value.id || 'None'
})

const decisionHistory = useStorage('slidev-decision-history', [])
const isBlackedOut = ref(false)

const toggleBlackout = (e) => {
  if (e) e.stopPropagation()
  isBlackedOut.value = !isBlackedOut.value
}
// Slide Alias Index
const aliasToIndex = ref({
  start: 1,
  overview: 2,
  overview_map: 3,
  breach: 4,
})

const debugInfo = ref('')

// Build alias map by resolving numeric routes
const buildAliasIndex = () => {
  const map = {}
  const count = Number(total.value) || 0
  for (let i = 1; i <= count; i++) {
    const resolved = router.resolve(`/${i}`)
    const fmForI = resolved?.meta?.slide?.frontmatter
    const alias = fmForI?.alias
    if (alias) map[alias.trim().toLowerCase()] = i
  }
  if (Object.keys(map).length > 0) {
    aliasToIndex.value = map
    console.log('Alias map built dynamically:', aliasToIndex.value)
  } else {
    console.warn('Alias builder found no aliases; keeping static map:', aliasToIndex.value)
  }
}

const navigate = (target) => {
  if (!target) return
  const strTarget = String(target).trim()
  const asNumber = Number(strTarget)

  let index
  if (!Number.isNaN(asNumber) && strTarget !== '') {
    index = asNumber
  } else {
    index = aliasToIndex.value[strTarget.toLowerCase()]
  }

  if (!index) {
    const fallback = aliasToIndex.value['start'] ?? 1
    console.warn(`Unknown target "${strTarget}", falling back to /${fallback}`)
    index = fallback
  }

  debugInfo.value = `Navigating to target="${strTarget}" → index=${index}`
  router.push(`/${index}`)
}

const resetPresentation = () => {
  decisionHistory.value = []
  const fallback = aliasToIndex.value['start'] ?? 1
  debugInfo.value = `Resetting presentation → index=${fallback}`
  router.push(`/${fallback}`)
}

const makeDecision = (choice) => {
  const rawTarget = choice === 'yes' ? fm.value.yesTarget : fm.value.noTarget
  if (!rawTarget) return

  const target = String(rawTarget).trim()

  decisionHistory.value.push({
    slide: currentPage.value,
    label: fm.value.question || 'Decision',
    choice: choice === 'yes' ? 'Y' : 'N'
  })

  navigate(target)
}

const goBack = () => {
  if (decisionHistory.value.length > 0) {
    const last = decisionHistory.value.pop()
    navigate(last.slide)
  } else {
    prev()
  }
}

// Keyboard shortcuts
onKeyStroke(['b', 'B'], (e) => { e.preventDefault(); toggleBlackout() })
onKeyStroke(['y', 'Y'], (e) => { if (fm.value.decision && !isBlackedOut.value) makeDecision('yes') })
onKeyStroke(['n', 'N'], (e) => { if (fm.value.decision && !isBlackedOut.value) makeDecision('no') })
onKeyStroke(['r', 'R'], (e) => { if (!isBlackedOut.value) resetPresentation() })

onMounted(buildAliasIndex)

// Log current slide metadata whenever it changes
watch(currentSlideRoute, (route) => {
  console.log("Current slide frontmatter:", route?.meta?.slide?.frontmatter)
})
</script>

<template>
  <div v-if="decisionHistory.length > 0" class="fixed top-0 left-0 p-3 z-50 flex gap-2 pointer-events-none">
    <div v-for="(step, i) in decisionHistory" :key="i" 
         class="bg-white/80 backdrop-blur border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] flex items-center gap-1">
      <span class="text-gray-500 uppercase tracking-tighter text-gray-400">{{ step.label }}</span>
      <span :class="step.choice === 'Y' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">{{ step.choice }}</span>
    </div>
  </div>

  <div class="fixed top-0 right-0 p-2 opacity-20 text-[10px] pointer-events-none font-mono flex flex-col items-end">
    <div>Slide: {{ currentPage }} / {{ total }}</div>
  </div>

  <div class="fixed bottom-8 right-8 flex items-center gap-6 z-[1000] pointer-events-none">
    <div class="flex items-center gap-4 pointer-events-auto bg-white/80 backdrop-blur p-2 rounded-lg border border-gray-200 shadow-sm">
      <button @click.stop="resetPresentation" title="Restart (R)" class="i-carbon:renew opacity-40 hover:opacity-100 cursor-pointer text-xl" />
      <div class="w-[1px] h-6 bg-gray-300 mx-1" />
      
      <template v-if="fm.decision">
        <button @click.stop="goBack" title="Back" class="i-carbon:arrow-left opacity-40 hover:opacity-100 transition cursor-pointer text-xl" />
        <button @click.stop="makeDecision('no')" class="px-5 py-2 bg-red-100 text-red-800 rounded border border-red-300 text-sm font-bold shadow-sm cursor-pointer active:scale-95 transition flex items-center gap-2">
          <span class="i-carbon:close-outline text-lg" /> NO
        </button>
        <button @click.stop="makeDecision('yes')" class="px-5 py-2 bg-green-100 text-green-800 rounded border border-green-300 text-sm font-bold shadow-sm cursor-pointer active:scale-95 transition flex items-center gap-2">
          <span class="i-carbon:checkmark-outline text-lg" /> YES
        </button>
      </template>

      <template v-else>
        <button @click.stop="toggleBlackout" class="i-carbon:asleep opacity-40 hover:opacity-100 cursor-pointer text-xl" />
        <button v-if="currentPage > 1" @click.stop="prev()" class="i-carbon:arrow-left opacity-40 hover:opacity-100 cursor-pointer text-xl" />
        <button v-if="currentPage < total" @click.stop="next()" class="i-carbon:arrow-right opacity-40 hover:opacity-100 cursor-pointer text-xl" />
      </template>
    </div>
  </div>

  <div v-if="isBlackedOut" @click="toggleBlackout" class="fixed inset-0 bg-black z-[2000] flex items-center justify-center cursor-pointer">
    <p class="text-white/30 uppercase tracking-widest text-sm font-bold">Paused</p>
  </div> 
    <!-- Debug overlay -->
<div v-if="showDebug" style="position:fixed;bottom:10px;right:10px;background:#000;color:#fff;padding:8px;">
  {{ debugInfo }}
</div>


</template>