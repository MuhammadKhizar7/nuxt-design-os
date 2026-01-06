<template>
  <div class="space-y-6">
    <!-- Page intro -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Product Definition
      </h1>
      <p class="text-stone-600 dark:text-stone-400">
        Define your product vision and break it into development sections.
      </p>
    </div>

    <!-- Step 1: Product Vision -->
    <StepIndicator :step="1" :status="stepStatuses[0]">
      <ProductOverviewCard v-if="productData.overview" :overview="productData.overview" />
      <EmptyState v-else type="overview" />
    </StepIndicator>

    <!-- Step 2: Roadmap -->
    <StepIndicator :step="2" :status="stepStatuses[1]" :is-last="!allStepsComplete">
      <SectionsCard v-if="productData.roadmap" :roadmap="productData.roadmap" />
      <EmptyState v-else type="roadmap" />
    </StepIndicator>

    <!-- Next Phase Button -->
    <StepIndicator v-if="allStepsComplete" :step="3" status="current" is-last>
      <NextPhaseButton next-phase="data-model" />
    </StepIndicator>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { useProductData } from '~/app/composables/useProductData'

const { data: productData, hasProductOverview, hasProductRoadmap } = useProductData()
console.log(productData.value)

const allStepsComplete = computed(() => hasProductOverview.value && hasProductRoadmap.value)

const stepStatuses = computed(() => {
  const statuses: ('completed' | 'current' | 'upcoming')[] = []

  // Step 1: Product Vision
  if (hasProductOverview.value) {
    statuses.push('completed')
  } else {
    statuses.push('current')
  }

  // Step 2: Roadmap
  if (hasProductRoadmap.value) {
    statuses.push('completed')
  } else if (hasProductOverview.value) {
    statuses.push('current')
  } else {
    statuses.push('upcoming')
  }

  return statuses
})
</script>
