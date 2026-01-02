<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductData } from '~/composables/useProductData'
import { useSectionData } from '~/composables/useSectionData'

const route = useRoute()
const router = useRouter()
const sectionId = computed(() => route.params.id as string)

const { data: productData } = useProductData()

// Wrap section data in computed to ensure reactivity when sectionId changes
const sectionState = computed(() => {
  return useSectionData(sectionId.value)
})

// Access flags and data from the reactive sectionState
const sectionData = computed(() => sectionState.value.sectionData)
const hasSpec = computed(() => sectionState.value.hasSpec)
const hasData = computed(() => sectionState.value.hasData)
const hasScreenDesigns = computed(() => sectionState.value.hasScreenDesigns)
const hasScreenshots = computed(() => sectionState.value.hasScreenshots)

const section = computed(() => productData.roadmap?.sections.find(s => s.id === sectionId.value))
const sections = computed(() => productData.roadmap?.sections || [])
const currentIndex = computed(() => sections.value.findIndex(s => s.id === sectionId.value))
const isLastSection = computed(() => currentIndex.value === sections.value.length - 1 || currentIndex.value === -1)
const nextSection = computed(() => !isLastSection.value ? sections.value[currentIndex.value + 1] : null)

const requiredStepsComplete = computed(() => hasSpec.value && hasData.value && hasScreenDesigns.value)

const stepStatuses = computed(() => {
  const steps = [hasSpec.value, hasData.value, hasScreenDesigns.value, hasScreenshots.value]
  const firstIncomplete = steps.findIndex(done => !done)
  
  return steps.map((done, index) => {
    if (done) return 'completed'
    if (index === firstIncomplete) return 'current'
    return 'upcoming'
  })
})

function navigateToNext() {
  if (nextSection.value) {
    router.push(`/sections/${nextSection.value.id}`)
  } else {
    router.push('/sections')
  }
}
</script>

<template>
  <div v-if="section" class="space-y-6">
    <!-- Page intro -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <UButton
          to="/sections"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
        >
          Back to Sections
        </UButton>
      </div>
      <h1 class="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        {{ section.title }}
      </h1>
      <p class="text-lg text-stone-600 dark:text-stone-400">
        {{ section.description }}
      </p>
    </div>

    <!-- Warning banner for incomplete prerequisite phases -->
    <PhaseWarningBanner />

    <!-- Step 1: Section Overview (Spec) -->
    <StepIndicator :step="1" :status="stepStatuses[0]">
      <SpecCard :spec="sectionData.specParsed" section-title="Section Overview" />
    </StepIndicator>

    <!-- Step 2: Sample Data -->
    <StepIndicator :step="2" :status="stepStatuses[1]">
      <DataCard :data="sectionData.data" />
    </StepIndicator>

    <!-- Step 3: Screen Designs -->
    <StepIndicator :step="3" :status="stepStatuses[2]">
      <div v-if="!hasScreenDesigns">
        <EmptyState type="screen-designs" />
      </div>
      <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm border-0">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Screen Designs
              <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                ({{ sectionData.screenDesigns.length }})
              </span>
            </h3>
          </div>
        </template>
        
        <div class="divide-y divide-stone-100 dark:divide-stone-800 -mx-6 -my-5">
          <NuxtLink
            v-for="design in sectionData.screenDesigns"
            :key="design.name"
            :to="`/sections/${sectionId}/screen-designs/${design.name}`"
            class="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                <UIcon name="i-lucide-layout" class="w-5 h-5 text-stone-600 dark:text-stone-300" />
              </div>
              <div class="truncate">
                <span class="font-medium text-stone-900 dark:text-stone-100 block group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {{ design.name }}
                </span>
                <span class="text-xs text-stone-500">Component design</span>
              </div>
            </div>
            <UIcon name="i-lucide-chevron-right" class="w-5 h-5 text-stone-400 dark:text-stone-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </NuxtLink>
        </div>
      </UCard>
    </StepIndicator>

    <!-- Step 4: Screenshots -->
    <StepIndicator :step="4" :status="stepStatuses[3]" :is-last="!requiredStepsComplete">
      <div v-if="!hasScreenshots">
        <UCard class="border-stone-200 dark:border-stone-700 shadow-sm border-dashed">
          <div class="flex flex-col items-center text-center max-w-sm mx-auto py-8">
            <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-image" class="w-6 h-6 text-stone-400 dark:text-stone-500" />
            </div>
            <h3 class="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
              No screenshots captured yet
            </h3>
            <p class="text-sm text-stone-500 dark:text-stone-400 mb-6">
              Capture screenshots of your screen designs for documentation and preview.
            </p>
            <div class="bg-stone-50 dark:bg-stone-900 rounded-lg px-4 py-3 w-full border border-stone-200 dark:border-stone-800">
              <p class="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                Available Command
              </p>
              <code class="text-sm font-mono text-primary-600 dark:text-primary-400">
                /screenshot-design
              </code>
            </div>
          </div>
        </UCard>
      </div>
      <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Screenshots
              <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                ({{ sectionData.screenshots.length }})
              </span>
            </h3>
          </div>
        </template>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="screenshot in sectionData.screenshots" :key="screenshot.name" class="group relative">
            <div class="aspect-video rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <img
                :src="screenshot.url"
                :alt="screenshot.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <UButton
                  :href="screenshot.url"
                  target="_blank"
                  icon="i-lucide-eye"
                  size="sm"
                  color="white"
                  variant="solid"
                >
                  View
                </UButton>
                <UButton
                  :href="screenshot.url"
                  :download="`${screenshot.name}.png`"
                  icon="i-lucide-download"
                  size="sm"
                  color="white"
                  variant="solid"
                >
                  Download
                </UButton>
              </div>
            </div>
            <div class="mt-3">
              <p class="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                {{ screenshot.name }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </StepIndicator>

    <!-- Step 5: Next Steps -->
    <StepIndicator v-if="requiredStepsComplete" :step="5" status="current" is-last>
      <div class="space-y-4">
        <UButton
          v-if="nextSection"
          block
          size="xl"
          color="black"
          icon="i-lucide-arrow-right"
          trailing
          @click="navigateToNext"
        >
          Continue to {{ nextSection.title }}
        </UButton>
        <UButton
          v-else
          block
          size="xl"
          color="black"
          icon="i-lucide-layout-list"
          @click="router.push('/sections')"
        >
          Back to All Sections
        </UButton>

        <UButton
          v-if="nextSection"
          block
          size="lg"
          variant="ghost"
          color="neutral"
          icon="i-lucide-layout-list"
          to="/sections"
        >
          View All Sections
        </UButton>
      </div>
    </StepIndicator>
  </div>

  <div v-else class="py-20 text-center">
    <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
    <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Section Not Found</h3>
    <p class="text-stone-500 dark:text-stone-400 mb-6">The requested section "{{ sectionId }}" could not be found.</p>
    <UButton to="/sections" variant="outline">Return to Sections</UButton>
  </div>
</template>
