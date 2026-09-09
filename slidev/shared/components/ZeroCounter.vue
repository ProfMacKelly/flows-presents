<template>
  <div
    v-if="isPresenter"
    class="fixed right-4 top-4 z-50 text-xs text-white bg-black/60 rounded px-2 py-1 select-none"
  >
    {{ currentZero }} / {{ total - 1 }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, isPresenter } = useNav()

const currentZero = computed(() => Math.max(0, currentPage.value - 1))
</script>

