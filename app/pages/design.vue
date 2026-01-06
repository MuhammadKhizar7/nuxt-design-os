<template>
  <div class="space-y-6">
    <!-- Page intro -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Design System
      </h1>
      <p class="text-stone-600 dark:text-stone-400">
        Define your design system: colors, typography, and application shell.
      </p>
    </div>

    <!-- Step 1: Design Tokens -->
    <StepIndicator :step="1" :status="stepStatuses[0]">
      <EmptyState v-if="!hasDesignSystem" type="design-system" />

      <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm">
        <template #header>
          <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Design Tokens
          </h3>
        </template>

        <div class="space-y-6">
          <!-- Colors -->
          <div v-if="designSystem?.colors">
            <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
              Colors
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div
                v-for="(colorName, label) in { Primary: designSystem.colors.primary, Secondary: designSystem.colors.secondary, Neutral: designSystem.colors.neutral }"
                :key="label">
                <div class="flex gap-0.5 mb-2">
                  <div class="flex-1 h-14 rounded-l-md" :style="{ backgroundColor: getColorValue(colorName, 'light') }"
                    :title="`${colorName}-300`" />
                  <div class="flex-[2] h-14" :style="{ backgroundColor: getColorValue(colorName, 'base') }"
                    :title="`${colorName}-500`" />
                  <div class="flex-1 h-14 rounded-r-md" :style="{ backgroundColor: getColorValue(colorName, 'dark') }"
                    :title="`${colorName}-600`" />
                </div>
                <p class="text-sm font-medium text-stone-900 dark:text-stone-100">{{ label }}</p>
                <p class="text-xs text-stone-500 dark:text-stone-400">{{ colorName }}</p>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div v-if="designSystem?.typography">
            <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
              Typography
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Heading</p>
                <p class="font-semibold text-stone-900 dark:text-stone-100">
                  {{ designSystem.typography.heading }}
                </p>
              </div>
              <div>
                <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Body</p>
                <p class="text-stone-900 dark:text-stone-100">
                  {{ designSystem.typography.body }}
                </p>
              </div>
              <div>
                <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Mono</p>
                <p class="font-mono text-stone-900 dark:text-stone-100">
                  {{ designSystem.typography.mono }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit hint -->
          <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
            <p class="text-xs text-stone-500 dark:text-stone-400">
              Run <code class="font-mono text-stone-700 dark:text-stone-300">/design-tokens</code> to update
            </p>
          </div>
        </div>
      </UCard>
    </StepIndicator>

    <!-- Step 2: Application Shell -->
    <StepIndicator :step="2" :status="stepStatuses[1]" :is-last="!allStepsComplete">
      <EmptyState v-if="!hasShell" type="shell" />

      <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm">
        <template #header>
          <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Application Shell
          </h3>
        </template>

        <div class="space-y-4">
          <!-- Overview -->
          <p v-if="shell?.spec?.overview" class="text-stone-600 dark:text-stone-400 leading-relaxed">
            {{ shell.spec.overview }}
          </p>

          <!-- Navigation items -->
          <div v-if="shell?.spec?.navigationItems?.length">
            <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
              Navigation
            </h4>
            <ul class="space-y-1">
              <li v-for="(item, index) in shell.spec.navigationItems" :key="index"
                class="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <span class="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                <!-- Simple rendering for now, could parse markdown bold if strictly needed but raw text is usually readable -->
                <span>{{ item.replace(/\*\*/g, '') }}</span>
              </li>
            </ul>
          </div>

          <!-- View Shell Design Link -->
          <div v-if="shell?.hasComponents" class="pt-2 border-t border-stone-100 dark:border-stone-800">
            <UButton to="/shell/design" variant="ghost"
              class="flex items-center justify-between gap-4 py-2 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group w-full p-0 h-auto">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                  <UIcon name="i-lucide-layout" class="w-4 h-4 text-stone-600 dark:text-stone-300" />
                </div>
                <span
                  class="font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                  View Shell Design
                </span>
              </div>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-stone-400 dark:text-stone-500" />
            </UButton>
          </div>

          <!-- Edit hint -->
          <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
            <p class="text-xs text-stone-500 dark:text-stone-400">
              Run <code class="font-mono text-stone-700 dark:text-stone-300">/design-shell</code> to update
            </p>
          </div>
        </div>
      </UCard>
    </StepIndicator>

    <!-- Next Phase Button -->
    <StepIndicator v-if="allStepsComplete" :step="3" status="current" is-last>
      <NextPhaseButton next-phase="sections" />
    </StepIndicator>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { useProductData } from '~/app/composables/useProductData'

const { data: productData, hasDesignSystem, hasShell } = useProductData()
console.log(productData.value)
const designSystem = computed(() => productData.value.designSystem)
const shell = computed(() => productData.value.shell)

const allStepsComplete = computed(() => hasDesignSystem.value && hasShell.value)

const stepStatuses = computed(() => {
  const statuses: ('completed' | 'current' | 'upcoming')[] = []

  // Step 1: Design Tokens
  if (hasDesignSystem.value) {
    statuses.push('completed')
  } else {
    statuses.push('current')
  }

  // Step 2: Shell
  if (hasShell.value) {
    statuses.push('completed')
  } else if (hasDesignSystem.value) {
    statuses.push('current')
  } else {
    statuses.push('upcoming')
  }

  return statuses
})

// Color Map
const colorMap: Record<string, { light: string; base: string; dark: string }> = {
  red: { light: '#fca5a5', base: '#ef4444', dark: '#dc2626' },
  orange: { light: '#fdba74', base: '#f97316', dark: '#ea580c' },
  amber: { light: '#fcd34d', base: '#f59e0b', dark: '#d97706' },
  yellow: { light: '#fde047', base: '#eab308', dark: '#ca8a04' },
  lime: { light: '#bef264', base: '#84cc16', dark: '#65a30d' },
  green: { light: '#86efac', base: '#22c55e', dark: '#16a34a' },
  emerald: { light: '#6ee7b7', base: '#10b981', dark: '#059669' },
  teal: { light: '#5eead4', base: '#14b8a6', dark: '#0d9488' },
  cyan: { light: '#67e8f9', base: '#06b6d4', dark: '#0891b2' },
  sky: { light: '#7dd3fc', base: '#0ea5e9', dark: '#0284c7' },
  blue: { light: '#93c5fd', base: '#3b82f6', dark: '#2563eb' },
  indigo: { light: '#a5b4fc', base: '#6366f1', dark: '#4f46e5' },
  violet: { light: '#c4b5fd', base: '#8b5cf6', dark: '#7c3aed' },
  purple: { light: '#d8b4fe', base: '#a855f7', dark: '#9333ea' },
  fuchsia: { light: '#f0abfc', base: '#d946ef', dark: '#c026d3' },
  pink: { light: '#f9a8d4', base: '#ec4899', dark: '#db2777' },
  rose: { light: '#fda4af', base: '#f43f5e', dark: '#e11d48' },
  slate: { light: '#cbd5e1', base: '#64748b', dark: '#475569' },
  gray: { light: '#d1d5db', base: '#6b7280', dark: '#4b5563' },
  zinc: { light: '#d4d4d8', base: '#71717a', dark: '#52525b' },
  neutral: { light: '#d4d4d4', base: '#737373', dark: '#525252' },
  stone: { light: '#d6d3d1', base: '#78716c', dark: '#57534e' },
}

function getColorValue(colorName: string, shade: 'light' | 'base' | 'dark'): string {
  const color = colorMap[colorName] || colorMap.stone
  return color[shade]
}
</script>
