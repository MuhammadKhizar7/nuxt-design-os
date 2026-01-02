<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  nextPhase: 'data-model' | 'design' | 'sections' | 'export'
}

const props = defineProps<Props>()

const phaseConfig = {
  'data-model': { label: 'Data Model', icon: 'i-lucide-boxes', path: '/data-model' },
  'design': { label: 'Design', icon: 'i-lucide-layout', path: '/design' },
  'sections': { label: 'Sections', icon: 'i-lucide-layout-list', path: '/sections' },
  'export': { label: 'Export', icon: 'i-lucide-package', path: '/export' },
}

const config = computed(() => phaseConfig[props.nextPhase])
</script>

<template>
  <UButton
    :to="config.path"
    size="xl"
    color="black"
    block
    :icon="config.icon"
    trailing-icon="i-lucide-arrow-right"
    class="group"
  >
    <span class="font-semibold">Continue to {{ config.label }}</span>
    <template #trailing>
      <UIcon name="i-lucide-arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </template>
  </UButton>
</template>
