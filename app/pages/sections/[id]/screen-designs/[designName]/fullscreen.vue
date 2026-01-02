<script setup lang="ts">
import { shallowRef, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadScreenDesignComponent, useSectionData } from '~/composables/useSectionData'
import AppShell from '~/components/shell/AppShell.vue'

definePageMeta({
  layout: false
})

const route = useRoute()
const sectionId = computed(() => route.params.id as string)
const designName = computed(() => route.params.designName as string)

const ScreenComponent = shallowRef<any>(null)
const error = shallowRef<string | null>(null)

// Wrap section data in computed to ensure reactivity
const sectionState = computed(() => useSectionData(sectionId.value))
const sectionData = computed(() => sectionState.value.sectionData)

// Check if section should use shell (default to true if shell components exist)
// In a real app, this would check spec.md
const shouldUseShell = computed(() => {
  // Simple check for now - can be expanded later to check sectionData.specParsed
  return true 
})

const componentProps = computed(() => sectionData.value.data || {})

async function loadComponent() {
  ScreenComponent.value = null
  error.value = null
  
  if (!sectionId.value || !designName.value) return

  try {
    const componentLoader = loadScreenDesignComponent(sectionId.value, designName.value)
    if (componentLoader) {
      ScreenComponent.value = componentLoader
    } else {
      error.value = `Screen design "${designName.value}" not found`
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load component'
  }
}

onMounted(loadComponent)
watch([sectionId, designName], loadComponent)

// Theme syncing logic (similar to legacy useEffect)
onMounted(() => {
  const applyTheme = () => {
    const theme = localStorage.getItem('nuxt-ui-color-mode') || 'system'
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }

  applyTheme()
  window.addEventListener('storage', (e) => {
    if (e.key === 'nuxt-ui-color-mode') applyTheme()
  })
  
  // Also poll since storage event doesn't fire in same tab/window for some setups
  const interval = setInterval(applyTheme, 500)
  return () => clearInterval(interval)
})
</script>

<template>
  <div v-if="error" class="h-screen flex items-center justify-center bg-white dark:bg-stone-950">
    <div class="text-red-500">{{ error }}</div>
  </div>
  <div v-else-if="!ScreenComponent" class="h-screen flex items-center justify-center bg-white dark:bg-stone-950">
    <div class="text-stone-500">Loading...</div>
  </div>
  <template v-else>
    <AppShell v-if="shouldUseShell">
      <component :is="ScreenComponent" v-bind="componentProps" />
    </AppShell>
    <component :is="ScreenComponent" v-else v-bind="componentProps" />
  </template>
</template>
