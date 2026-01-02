<template>
  <div v-if="shouldShow" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6">
    <div class="flex items-start gap-3">
      <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
      <div class="flex-1 min-w-0">
        <p class="text-sm text-amber-800 dark:text-amber-200">
          Consider completing 
          <span v-for="(phase, index) in missingPhases" :key="phase.path">
            {{ index > 0 ? ' and ' : '' }}
            <NuxtLink :to="phase.path" class="font-medium underline hover:no-underline">
              {{ phase.name }}
            </NuxtLink>
          </span>
          before designing sections.
        </p>
      </div>
      <button
        @click="handleDismiss"
        class="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors shrink-0"
      >
        <UIcon name="i-lucide-x" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import { useProductData } from '~/app/composables/useProductData'

const { data: productData, hasDataModel, hasDesignSystem, hasShell } = useProductData()
const isDismissed = ref(true) // Start dismissed to avoid flash

const hasDesign = computed(() => hasDesignSystem || hasShell)
const productName = computed(() => productData.overview?.name || 'default-product')

const storageKey = computed(() => {
  const sanitized = productName.value
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
  return `design-os-phase-warning-dismissed-${sanitized}`
})

const missingPhases = computed(() => {
  const missing: { name: string; path: string }[] = []
  if (!hasDataModel) {
    missing.push({ name: 'Data Model', path: '/data-model' })
  }
  if (!hasDesign.value) {
    missing.push({ name: 'Design', path: '/design' })
  }
  return missing
})

const shouldShow = computed(() => {
  if ((hasDataModel && hasDesign.value) || isDismissed.value) {
    return false
  }
  return true
})

onMounted(() => {
  isDismissed.value = localStorage.getItem(storageKey.value) === 'true'
})

function handleDismiss() {
  localStorage.setItem(storageKey.value, 'true')
  isDismissed.value = true
}
</script>
