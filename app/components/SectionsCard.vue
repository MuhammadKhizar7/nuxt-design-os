<template>
  <UCard class="border-stone-200 dark:border-stone-700 shadow-sm" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <template #header>
      <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
        Sections
      </h3>
    </template>

    <ul class="divide-y divide-stone-200 dark:divide-stone-700">
      <li v-for="section in roadmap.sections" :key="section.id">
        <UButton
          :to="`/sections/${section.id}`"
          variant="ghost"
          class="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors rounded-none h-auto block"
        >
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <span class="shrink-0 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium flex items-center justify-center">
              {{ section.order }}
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="font-medium text-stone-900 dark:text-stone-100 truncate">
                {{ section.title }}
              </h3>
              <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                {{ section.description }}
              </p>
            </div>
          </div>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" />
        </UButton>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { ProductRoadmap } from '@/types/product'

defineProps<{
  roadmap: ProductRoadmap
}>()
</script>
