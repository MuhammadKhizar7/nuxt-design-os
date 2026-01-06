<script setup lang="ts">
import { computed } from 'vue'
import { useProductData } from '~/composables/useProductData'

const { data: productData, hasProductRoadmap } = useProductData()

const sections = computed(() => productData.value.roadmap?.sections || [])

// Get progress from productData
const sectionProgressMap = computed(() => productData.value.sectionProgress || {})

// Count completed sections (those with spec, data, AND screen designs)
const completedSections = computed(() => {
  return sections.value.filter(s => {
    const p = sectionProgressMap.value[s.id]
    return p?.hasSpec && p?.hasData && p?.hasScreenDesigns
  }).length
})

const allSectionsComplete = computed(() => {
  return sections.value.length > 0 && completedSections.value === sections.value.length
})
</script>

<template>
  <div class="space-y-8">
    <!-- Page intro -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
        Sections
      </h1>
      <p class="text-lg text-stone-600 dark:text-stone-400">
        Design each section of your product with specifications, sample data, and screen designs.
      </p>
      <p v-if="sections.length > 0" class="text-sm text-stone-500 dark:text-stone-400 mt-3 font-medium">
        {{ completedSections }} of {{ sections.length }} sections completed
      </p>
    </div>

    <!-- Warning banner for incomplete prerequisite phases -->
    <PhaseWarningBanner />

    <!-- Sections list -->
    <EmptyState v-if="!Boolean(hasProductRoadmap) || sections.length === 0" type="roadmap" />

    <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
      <template #header>
        <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
          All Sections
        </h2>
      </template>

      <div class="divide-y divide-stone-100 dark:divide-stone-800 -mx-6 -my-5">
        <NuxtLink v-for="section in sections" :key="section.id" :to="`/sections/${section.id}`"
          class="flex items-center justify-between gap-4 px-6 py-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <!-- Status indicator -->
            <div class="shrink-0 mt-0.5">
              <div
                v-if="sectionProgressMap[section.id]?.hasSpec && sectionProgressMap[section.id]?.hasData && sectionProgressMap[section.id]?.hasScreenDesigns"
                class="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center ring-2 ring-green-200 dark:ring-green-900/40">
                <UIcon name="i-lucide-check" class="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div v-else
                class="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center border-2 border-stone-200 dark:border-stone-700">
                <span class="text-xs font-bold text-stone-600 dark:text-stone-400">
                  {{ section.order }}
                </span>
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <h3
                class="font-semibold text-stone-900 dark:text-stone-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ section.title }}
              </h3>
              <p class="text-sm text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                {{ section.description }}
              </p>

              <!-- Progress indicators -->
              <div class="flex items-center gap-4 mt-3 flex-wrap">
                <!-- Spec -->
                <span :class="[
                  'flex items-center gap-1.5 text-xs font-medium',
                  sectionProgressMap[section.id]?.hasSpec
                    ? 'text-stone-700 dark:text-stone-300'
                    : 'text-stone-400 dark:text-stone-500'
                ]">
                  <UIcon :name="sectionProgressMap[section.id]?.hasSpec ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    class="w-3.5 h-3.5"
                    :class="sectionProgressMap[section.id]?.hasSpec ? 'text-green-600 dark:text-green-400' : ''" />
                  Spec
                </span>

                <!-- Data -->
                <span :class="[
                  'flex items-center gap-1.5 text-xs font-medium',
                  sectionProgressMap[section.id]?.hasData
                    ? 'text-stone-700 dark:text-stone-300'
                    : 'text-stone-400 dark:text-stone-500'
                ]">
                  <UIcon :name="sectionProgressMap[section.id]?.hasData ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    class="w-3.5 h-3.5"
                    :class="sectionProgressMap[section.id]?.hasData ? 'text-green-600 dark:text-green-400' : ''" />
                  Data
                </span>

                <!-- Screen Designs -->
                <span :class="[
                  'flex items-center gap-1.5 text-xs font-medium',
                  sectionProgressMap[section.id]?.hasScreenDesigns
                    ? 'text-stone-700 dark:text-stone-300'
                    : 'text-stone-400 dark:text-stone-500'
                ]">
                  <UIcon
                    :name="sectionProgressMap[section.id]?.hasScreenDesigns ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    class="w-3.5 h-3.5"
                    :class="sectionProgressMap[section.id]?.hasScreenDesigns ? 'text-green-600 dark:text-green-400' : ''" />
                  {{ sectionProgressMap[section.id]?.screenDesignCount || 0 }} Screen Design{{
                    sectionProgressMap[section.id]?.screenDesignCount !== 1 ? 's' : '' }}
                </span>

                <!-- Screenshots (optional) -->
                <span :class="[
                  'flex items-center gap-1.5 text-xs font-medium',
                  sectionProgressMap[section.id]?.hasScreenshots
                    ? 'text-stone-700 dark:text-stone-300'
                    : 'text-stone-300 dark:text-stone-600 opacity-60'
                ]">
                  <UIcon
                    :name="sectionProgressMap[section.id]?.hasScreenshots ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                    class="w-3.5 h-3.5"
                    :class="sectionProgressMap[section.id]?.hasScreenshots ? 'text-green-600 dark:text-green-400' : ''" />
                  {{ sectionProgressMap[section.id]?.screenshotCount || 0 }} Screenshot{{
                    sectionProgressMap[section.id]?.screenshotCount !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>

          <UIcon name="i-lucide-chevron-right"
            class="w-5 h-5 text-stone-400 dark:text-stone-500 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>
    </UCard>

    <!-- Next Phase Button - shown when all sections are complete -->
    <NextPhaseButton v-if="allSectionsComplete" next-phase="export" />
  </div>
</template>
