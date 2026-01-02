<template>
  <div class="relative">
    <!-- Vertical connecting line -->
    <div
      v-if="!isLast"
      class="absolute left-[10px] top-[28px] w-[2px] h-[calc(100%+16px)] bg-stone-200 dark:bg-stone-700"
      aria-hidden="true"
    />

    <!-- Step badge -->
    <div class="absolute -left-[2px] top-0 z-10">
      <div :class="[baseClasses, statusClasses]">
        <UIcon v-if="status === 'completed'" name="i-lucide-check" class="w-3 h-3" />
        <UIcon v-else-if="status === 'current'" name="i-lucide-arrow-right" class="w-3 h-3" />
        <UIcon v-else-if="status === 'skipped'" name="i-lucide-alert-triangle" class="w-3 h-3" />
        <span v-else>{{ step }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="pl-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'skipped'

const props = withDefaults(defineProps<{
  step: number
  status: StepStatus
  isLast?: boolean
}>(), {
  isLast: false
})

const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"

const statusClasses = computed(() => {
  switch (props.status) {
    case 'completed':
      return "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
    case 'current':
      return "bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm"
    case 'skipped':
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    default: // upcoming
      return "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400"
  }
})
</script>
