<template>
  <UCard class="border-stone-200 dark:border-stone-700 shadow-sm border-dashed">
    <div class="py-8 flex flex-col items-center text-center max-w-sm mx-auto">
      <div class="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
        <UIcon :name="config.icon" class="w-5 h-5 text-stone-400 dark:text-stone-500" />
      </div>
      <h3 class="text-base font-medium text-stone-600 dark:text-stone-400 mb-1">
        {{ config.title }}
      </h3>
      <p class="text-sm text-stone-500 dark:text-stone-400 mb-4">
        {{ config.description }}
      </p>
      <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5 w-full">
        <p class="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
          Run in Claude Code:
        </p>
        <code class="text-sm font-mono text-stone-700 dark:text-stone-300">
          {{ config.command }}
        </code>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type EmptyStateType = 'overview' | 'roadmap' | 'spec' | 'data' | 'screen-designs' | 'data-model' | 'design-system' | 'shell' | 'export'

const props = defineProps<{
  type: EmptyStateType
}>()

const configs: Record<EmptyStateType, {
  icon: string
  title: string
  command: string
  description: string
}> = {
  overview: {
    icon: 'i-lucide-file-text',
    title: 'No product defined yet',
    command: '/product-vision',
    description: 'Define your product vision, key problems, and features',
  },
  roadmap: {
    icon: 'i-lucide-map',
    title: 'No roadmap defined yet',
    command: '/product-roadmap',
    description: 'Break down your product into development sections',
  },
  spec: {
    icon: 'i-lucide-clipboard-list',
    title: 'No specification defined yet',
    command: '/shape-section',
    description: 'Define the user flows and UI requirements',
  },
  data: {
    icon: 'i-lucide-database',
    title: 'No sample data generated yet',
    command: '/sample-data',
    description: 'Create realistic sample data for screen designs',
  },
  'screen-designs': {
    icon: 'i-lucide-layout',
    title: 'No screen designs created yet',
    command: '/design-screen',
    description: 'Create screen designs for this section',
  },
  'data-model': {
    icon: 'i-lucide-boxes',
    title: 'No data model defined yet',
    command: '/data-model',
    description: 'Define the core entities and relationships',
  },
  'design-system': {
    icon: 'i-lucide-palette',
    title: 'No design tokens defined yet',
    command: '/design-tokens',
    description: 'Choose colors and typography for your product',
  },
  shell: {
    icon: 'i-lucide-panel-left',
    title: 'No application shell designed yet',
    command: '/design-shell',
    description: 'Design the navigation and layout',
  },
  export: {
    icon: 'i-lucide-package',
    title: 'Ready to export',
    command: '/export-product',
    description: 'Generate the complete handoff package',
  },
}

const config = computed(() => configs[props.type])
</script>
