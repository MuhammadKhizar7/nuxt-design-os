<template>
  <EmptyState v-if="!data" type="data" />

  <UCard v-else class="border-stone-200 dark:border-stone-700 shadow-sm">
    <template #header>
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Sample Data
        </h3>
        <span v-if="recordCount > 0" class="text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
          {{ recordCount }} {{ recordCount === 1 ? 'record' : 'records' }}
        </span>
      </div>
    </template>

    <div class="pt-0 space-y-4">
      <!-- Data Model Descriptions -->
      <div v-if="meta" class="space-y-6">
        <!-- Models - Card Grid -->
        <div>
          <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
            Data Models
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="(description, modelName) in meta.models"
              :key="modelName"
              class="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
            >
              <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                {{ modelName }}
              </h3>
              <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                {{ description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Relationships -->
        <div v-if="meta.relationships.length > 0">
          <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
            How They Connect
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(relationship, index) in meta.relationships"
              :key="index"
              class="text-stone-700 dark:text-stone-300 flex items-start gap-3"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
              {{ relationship }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Collapsible JSON View -->
      <!-- Collapsible JSON View -->
      <UAccordion 
        :items="[{ label: 'View JSON', slot: 'json', icon: 'i-lucide-code-2' }]"
        variant="ghost"
        color="black"
      >
        <template #json>
          <div class="bg-stone-50 dark:bg-stone-900 rounded-md p-4 overflow-x-auto mt-3">
            <pre class="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
              {{ JSON.stringify(dataWithoutMeta, null, 2) }}
            </pre>
          </div>
        </template>
      </UAccordion>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DataMeta {
  models: Record<string, string>
  relationships: string[]
}

const props = defineProps<{
  data: Record<string, unknown> | null
}>()



const meta = computed(() => {
  if (!props.data) return null
  const m = props.data._meta as DataMeta | undefined
  if (m && typeof m === 'object' && m.models && m.relationships) {
    return m
  }
  return null
})

const dataWithoutMeta = computed(() => {
  if (!props.data) return {}
  const { _meta, ...rest } = props.data
  return rest
})

const recordCount = computed(() => {
  if (!props.data) return 0
  let count = 0
  for (const [key, value] of Object.entries(props.data)) {
    if (key !== '_meta' && Array.isArray(value)) {
      count += value.length
    }
  }
  return count
})

</script>
