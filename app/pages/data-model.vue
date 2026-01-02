<template>
  <div class="space-y-6">
    <!-- Page intro -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Data Model
      </h1>
      <p class="text-stone-600 dark:text-stone-400">
        Define your data entities and relationships.
      </p>
    </div>

    <!-- Step 1: Data Model -->
    <StepIndicator :step="1" :status="stepStatus" :is-last="!hasDataModel">
      <EmptyState v-if="!dataModel" type="data-model" />
      
      <div v-else class="space-y-6">
        <!-- Entities -->
        <UCard class="border-stone-200 dark:border-stone-700 shadow-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Entities
                <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                  ({{ dataModel.entities.length }})
                </span>
              </h2>
            </div>
          </template>
          
          <div v-if="dataModel.entities.length === 0">
            <p class="text-stone-500 dark:text-stone-400">No entities defined.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(entity, index) in dataModel.entities"
              :key="index"
              class="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
            >
              <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                {{ entity.name }}
              </h3>
              <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                {{ entity.description }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Relationships -->
        <UCard class="border-stone-200 dark:border-stone-700 shadow-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Relationships
                <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                  ({{ dataModel.relationships.length }})
                </span>
              </h2>
            </div>
          </template>

          <div v-if="dataModel.relationships.length === 0">
            <p class="text-stone-500 dark:text-stone-400">No relationships defined.</p>
          </div>
          
          <ul v-else class="space-y-2">
            <li v-for="(relationship, index) in dataModel.relationships" :key="index" class="flex items-start gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
              <span class="text-stone-700 dark:text-stone-300">
                {{ relationship }}
              </span>
            </li>
          </ul>
        </UCard>

        <!-- Edit hint -->
        <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
          <p class="text-sm text-stone-600 dark:text-stone-400">
            To update the data model, run
            <code class="font-mono text-stone-800 dark:text-stone-200">/data-model</code>
            or edit the file directly at
            <code class="font-mono text-stone-800 dark:text-stone-200">
              product/data-model/data-model.md
            </code>
          </p>
        </div>
      </div>
    </StepIndicator>

    <!-- Next Phase Button -->
    <StepIndicator v-if="hasDataModel" :step="2" status="current" is-last>
      <NextPhaseButton next-phase="design" />
    </StepIndicator>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { useProductData } from '~/app/composables/useProductData' // auto imported no need to import

const { data, hasDataModel } = useProductData()
const dataModel = computed(() => data.dataModel)
const stepStatus = computed(() => hasDataModel ? 'completed' : 'current')
</script>
