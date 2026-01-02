<template>
  <UCard class="border-stone-200 dark:border-stone-700 shadow-sm">
    <template #header>
      <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
        Product overview: {{ overview.name }}
      </h3>
    </template>

    <div class="space-y-4">
      <!-- Description -->
      <p v-if="overview.description" class="text-stone-600 dark:text-stone-400 leading-relaxed">
        {{ overview.description }}
      </p>

      <!-- Problems & Solutions -->
      <div v-if="overview.problems.length > 0">
        <UAccordion 
          :items="[{ label: `Problems & Solutions (${overview.problems.length})`, slot: 'problems', icon: 'i-lucide-alert-circle' }]"
          variant="ghost"
          color="black"
        >
          <template #problems>
            <ul class="space-y-3 pt-2">
              <li v-for="(problem, index) in overview.problems" :key="index" class="flex items-start gap-3">
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-stone-900 dark:text-stone-100 mt-1 shrink-0" />
                <div>
                  <span class="font-medium text-stone-800 dark:text-stone-200">
                    {{ problem.title }}
                  </span>
                  <span class="text-stone-500 dark:text-stone-400 mx-2">—</span>
                  <span class="text-stone-600 dark:text-stone-400">
                    {{ problem.solution }}
                  </span>
                </div>
              </li>
            </ul>
          </template>
        </UAccordion>
      </div>

      <!-- Key Features -->
      <div v-if="overview.features.length > 0">
        <!-- Collapsible Features -->
        <UAccordion 
          :items="[{ label: `Key Features (${overview.features.length})`, slot: 'features', icon: 'i-lucide-list-checks' }]"
          variant="ghost"
          color="black"
        >
          <template #features>
            <ul class="space-y-2 pt-2 ml-1">
              <li v-for="(feature, index) in overview.features" :key="index" class="flex items-start gap-4">
                <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                <span class="text-stone-700 dark:text-stone-300">
                  {{ feature }}
                </span>
              </li>
            </ul>
          </template>
        </UAccordion>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ProductOverview } from '~~/types/product'

defineProps<{
  overview: ProductOverview
}>()

</script>
