<template>
  <nav class="flex items-center justify-center">
    <div
      v-for="(phaseInfo, index) in phaseInfos"
      :key="phaseInfo.phase.id"
      class="flex items-center"
    >
      <!-- Connector line -->
      <div
        v-if="index > 0"
        :class="[
          'w-4 sm:w-8 lg:w-12 h-px transition-colors duration-200',
          phaseInfo.status === 'upcoming'
            ? 'bg-stone-200 dark:bg-stone-700'
            : 'bg-stone-400 dark:bg-stone-500'
        ]"
      />

      <!-- Phase button -->
      <UButton
        :to="phaseInfo.phase.path"
        :class="[
          'group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 whitespace-nowrap',
          phaseInfo.status === 'current'
            ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm'
            : phaseInfo.status === 'completed'
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
        ]"
        variant="ghost"
      >
        <UIcon
          :name="phaseInfo.phase.icon"
          :class="[
            'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
            phaseInfo.status === 'upcoming' ? 'opacity-60' : ''
          ]"
        />
        <span
          :class="[
            'text-sm font-medium hidden sm:inline',
            phaseInfo.status === 'upcoming' ? 'opacity-60' : ''
          ]"
        >
          {{ phaseInfo.phase.label }}
        </span>

        <!-- Completion indicator -->
        <span
          v-if="phaseInfo.isComplete"
          class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center shadow-sm"
        >
          <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </UButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
export type Phase = 'product' | 'data-model' | 'design' | 'sections' | 'export'
export type PhaseStatus = 'completed' | 'current' | 'upcoming'

interface PhaseConfig {
  id: Phase
  label: string
  icon: string
  path: string
}

interface PhaseInfo {
  phase: PhaseConfig
  status: PhaseStatus
  isComplete: boolean
}

const phases: PhaseConfig[] = [
  { id: 'product', label: 'Product', icon: 'i-heroicons-document-text', path: '/' },
  { id: 'data-model', label: 'Data Model', icon: 'i-heroicons-cube', path: '/data-model' },
  { id: 'design', label: 'Design', icon: 'i-heroicons-squares-2x2', path: '/design' },
  { id: 'sections', label: 'Sections', icon: 'i-heroicons-queue-list', path: '/sections' },
  { id: 'export', label: 'Export', icon: 'i-heroicons-archive-box', path: '/export' },
]

const route = useRoute()

// Use composable for real data
// import { useProductData } from '~/app/composables/useProductData'

import { useProductData } from '~/composables/useProductData'
import { useSectionData } from '~/composables/useSectionData'

const { data: productData,
  hasProductOverview, 
  hasProductRoadmap, 
  hasDataModel, 
  hasDesignSystem, 
  hasShell,
  exportZipAvailable
} = useProductData()

const allSectionsComplete = computed(() => {
  if (!productData?.roadmap?.sections) return false
  return productData.roadmap.sections.every(section => {
    const { hasSpec, hasData, hasScreenDesigns } = useSectionData(section.id)
    return hasSpec && hasData && hasScreenDesigns
  })
})

const phaseInfos = computed<PhaseInfo[]>(() => {
  const currentPath = route.path
  let currentPhaseId: Phase = 'product'

  if (currentPath === '/' || currentPath === '/product') {
    currentPhaseId = 'product'
  } else if (currentPath === '/data-model') {
    currentPhaseId = 'data-model'
  } else if (currentPath === '/design' || currentPath.startsWith('/shell')) {
    currentPhaseId = 'design'
  } else if (currentPath === '/sections' || currentPath.startsWith('/sections/')) {
    currentPhaseId = 'sections'
  } else if (currentPath === '/export') {
    currentPhaseId = 'export'
  }

  const phaseComplete: Record<Phase, boolean> = {
    'product': !!(hasProductOverview && hasProductRoadmap),
    'data-model': !!hasDataModel,
    'design': !!(hasDesignSystem && hasShell),
    'sections': allSectionsComplete.value,
    'export': exportZipAvailable.value,
  }

  return phases.map(phase => {
    const isComplete = phaseComplete[phase.id]
    let status: PhaseStatus
    if (phase.id === currentPhaseId) {
      status = 'current'
    } else if (isComplete) {
      status = 'completed'
    } else {
      status = 'upcoming'
    }
    return { phase, status, isComplete }
  })
})
</script>
