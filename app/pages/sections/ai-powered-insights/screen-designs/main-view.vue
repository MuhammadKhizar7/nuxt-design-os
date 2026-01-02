<script setup lang="ts">
import { useSectionData } from '@/composables/useSectionData'
import MainView from '@/components/sections/ai-powered-insights/MainView.vue'
import AppShell from '@/components/shell/AppShell.vue'
import type { AIPoweredInsightsProps } from '@/product/sections/ai-powered-insights/types'

const { data, navigationItems, user, handleNavigate } = useSectionData('ai-powered-insights')

const sectionData = data as AIPoweredInsightsProps

function logEvent(name: string, payload: any) {
  console.log(`Event from AI-Insights: ${name}`, payload)
}
</script>

<template>
  <AppShell
    :navigation-items="navigationItems"
    :user="user"
    @navigate="handleNavigate"
    @logout="() => logEvent('logout', {})"
  >
    <MainView v-if="sectionData" :jobs="sectionData.jobs" />
    <div v-else class="p-8 text-center">
      <p>Loading section data...</p>
    </div>
  </AppShell>
</template>
