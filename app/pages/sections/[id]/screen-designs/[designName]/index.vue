<template>
  <div class="h-screen bg-stone-100 dark:bg-stone-900 animate-fade-in flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 z-50">
      <div class="px-4 py-2 flex items-center gap-4">
        <UButton :to="`/sections/${sectionId}`" variant="ghost" size="sm"
          class="-ml-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          icon="i-lucide-arrow-left">
          Back
        </UButton>
        <div class="h-4 w-px bg-stone-200 dark:bg-stone-700" />
        <div class="flex items-center gap-2 min-w-0">
          <UIcon name="i-lucide-layout" class="w-4 h-4 text-stone-400 shrink-0" />
          <span v-if="section" class="text-sm text-stone-500 dark:text-stone-400 truncate">
            {{ section.title }}
          </span>
          <span class="text-stone-300 dark:text-stone-600">/</span>
          <span class="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
            {{ designName }}
          </span>
        </div>

        <!-- Width indicator and device presets -->
        <div class="ml-auto flex items-center gap-4">
          <!-- Device size presets -->
          <div class="flex items-center gap-1 border-r border-stone-200 dark:border-stone-700 pr-4">
            <button @click="widthPercent = 30" class="p-1.5 rounded transition-colors"
              :class="widthPercent <= 40
                ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'" title="Mobile (30%)">
              <UIcon name="i-lucide-smartphone" class="w-4 h-4" />
            </button>
            <button @click="widthPercent = 60" class="p-1.5 rounded transition-colors"
              :class="widthPercent > 40 && widthPercent <= 60
                ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'" title="Tablet (60%)">
              <UIcon name="i-lucide-tablet" class="w-4 h-4" />
            </button>
            <button @click="widthPercent = 100" class="p-1.5 rounded transition-colors"
              :class="widthPercent > 60
                ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'" title="Desktop (100%)">
              <UIcon name="i-lucide-monitor" class="w-4 h-4" />
            </button>
          </div>
          <span class="text-xs text-stone-500 dark:text-stone-400 font-mono w-10 text-right">
            {{ Math.round(widthPercent) }}%
          </span>

          <ThemeToggle />

          <a :href="`/sections/${sectionId}/screen-designs/${designName}/fullscreen`" target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
            <UIcon name="i-lucide-maximize-2" class="w-3.5 h-3.5" />
            Fullscreen
          </a>
        </div>
      </div>
    </header>

    <!-- Preview area with resizable container -->
    <div ref="containerRef" class="flex-1 overflow-hidden flex items-stretch justify-center p-6">
      <!-- Left resize handle -->
      <div class="w-4 flex items-center justify-center cursor-ew-resize group shrink-0" @mousedown="handleMouseDown">
        <div
          class="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
          <UIcon name="i-lucide-grip-vertical"
            class="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <!-- Preview container using iframe for true isolation -->
      <div
        class="bg-white dark:bg-stone-950 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
        :style="{ width: `${widthPercent}%`, minWidth: `${MIN_WIDTH}px`, maxWidth: '100%' }">
        <iframe :src="`/sections/${sectionId}/screen-designs/${designName}/fullscreen`" class="w-full h-full border-0"
          title="Screen Design Preview" />
      </div>

      <!-- Right resize handle -->
      <div class="w-4 flex items-center justify-center cursor-ew-resize group shrink-0" @mousedown="handleMouseDown">
        <div
          class="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
          <UIcon name="i-lucide-grip-vertical"
            class="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductData } from '~/composables/useProductData'

definePageMeta({
  layout: false
})

const route = useRoute()
const sectionId = computed(() => route.params.id as string)
const designName = computed(() => route.params.designName as string)

const { data: productData } = useProductData()
const section = computed(() => productData.value.roadmap?.sections.find(s => s.id === sectionId.value))

const MIN_WIDTH = 320
const DEFAULT_WIDTH_PERCENT = 100

const widthPercent = ref(DEFAULT_WIDTH_PERCENT)
const containerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || !containerRef.value) return

  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerCenter = containerRect.left + containerWidth / 2

  // Calculate distance from center
  const distanceFromCenter = Math.abs(e.clientX - containerCenter)
  const maxDistance = containerWidth / 2

  // Convert to percentage (distance from center * 2 = total width)
  let newWidthPercent = (distanceFromCenter / maxDistance) * 100

  // Clamp between min width and 100%
  const minPercent = (MIN_WIDTH / containerWidth) * 100
  newWidthPercent = Math.max(minPercent, Math.min(100, newWidthPercent))

  widthPercent.value = newWidthPercent
}

function handleMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function handleMouseDown() {
  isDragging.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>
