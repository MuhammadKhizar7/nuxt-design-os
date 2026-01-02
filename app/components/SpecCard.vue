<template>
  <EmptyState v-if="!spec" type="spec" />

  <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm">
    <template #header>
      <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
        {{ sectionTitle || 'Specification' }}
      </h3>
    </template>

    <div class="space-y-4">
      <!-- Overview -->
      <p v-if="spec.overview" class="text-stone-600 dark:text-stone-400 leading-relaxed">
        {{ spec.overview }}
      </p>

      <!-- Specs Accordion -->
      <div v-if="spec.userFlows.length > 0 || spec.uiRequirements.length > 0">
        <UAccordion
          :items="[
            ...(spec.userFlows.length > 0 ? [{ label: `User Flows (${spec.userFlows.length})`, slot: 'user-flows', icon: 'i-lucide-git-merge' }] : []),
            ...(spec.uiRequirements.length > 0 ? [{ label: `UI Requirements (${spec.uiRequirements.length})`, slot: 'ui-reqs', icon: 'i-lucide-check-square' }] : [])
          ]"
          variant="ghost"
          color="black"
        >
          <template #user-flows>
            <ul class="space-y-2 pt-2">
              <li v-for="(flow, index) in spec.userFlows" :key="index" class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                <span class="text-stone-700 dark:text-stone-300 text-sm">
                  {{ flow }}
                </span>
              </li>
            </ul>
          </template>

          <template #ui-reqs>
            <ul class="space-y-2 pt-2">
              <li v-for="(req, index) in spec.uiRequirements" :key="index" class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                <span class="text-stone-700 dark:text-stone-300 text-sm">
                  {{ req }}
                </span>
              </li>
            </ul>
          </template>
        </UAccordion>
      </div>

      <!-- Display Configuration -->
      <div class="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
        <template v-if="spec.useShell">
          <UIcon name="i-lucide-panel-top" class="w-4 h-4 text-stone-400 dark:text-stone-500" />
          <span class="text-sm text-stone-500 dark:text-stone-400">
            Displays inside app shell
          </span>
        </template>
        <template v-else>
          <UIcon name="i-lucide-square" class="w-4 h-4 text-stone-400 dark:text-stone-500" />
          <span class="text-sm text-stone-500 dark:text-stone-400">
            Standalone page (no shell)
          </span>
        </template>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">

import type { ParsedSpec } from '~~/types/section'

defineProps<{
  spec: ParsedSpec | null
  sectionTitle?: string
}>()


</script>
