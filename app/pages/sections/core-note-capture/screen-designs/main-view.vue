<script setup lang="ts">
import { useSectionData } from '@/composables/useSectionData'
import MainView from '@/components/sections/core-note-capture/MainView.vue'
import AppShell from '@/components/shell/AppShell.vue'
import type { CoreNoteCaptureProps } from '@/product/sections/core-note-capture/types'

const { data, navigationItems, user, handleNavigate } = useSectionData('core-note-capture')

const sectionData = data as CoreNoteCaptureProps

function logEvent(name: string, payload: any) {
  console.log(`Event: ${name}`, payload)
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
      :suggested-research="sectionData.suggestedResearch"
      @new-note="(p) => logEvent('newNote', p)"
      @record-voice="() => logEvent('recordVoice', {})"
      @attach-file="() => logEvent('attachFile', {})"
      @start-research="(id) => logEvent('startResearch', { id })"
    />
    <div v-else class="p-8 text-center">
      <p>Loading section data...</p>
    </div>
  </AppShell>
</template>
