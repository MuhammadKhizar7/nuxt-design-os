<script setup lang="ts">
import { useSectionData } from '@/composables/useSectionData'
import MainView from '@/components/sections/note-organization-visualization/MainView.vue'
import AppShell from '@/components/shell/AppShell.vue'
import type { NoteOrganizationVisualizationProps } from '@/product/sections/note-organization-visualization/types'

const { data, navigationItems, user, handleNavigate } = useSectionData('note-organization-visualization')

const sectionData = data as NoteOrganizationVisualizationProps

function logEvent(name: string, payload: any) {
  console.log(`Event from Note-Org-Viz: ${name}`, payload)
}
</script>

<template>
  <AppShell
    :navigation-items="navigationItems"
    :user="user"
    @navigate="handleNavigate"
    @logout="() => logEvent('logout', {})"
  >
    <MainView
      v-if="sectionData"
      :notes="sectionData.notes"
      :categories="sectionData.categories"
      :tags="sectionData.tags"
      :graph="sectionData.graph"
      :suggested-research="section.suggestedResearch"
    />
    <div v-else class="p-8 text-center">
      <p>Loading section data...</p>
    </div>
  </AppShell>
</template>
