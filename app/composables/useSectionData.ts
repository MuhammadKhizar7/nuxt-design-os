import type { SectionData, ParsedSpec, ScreenDesignInfo, ScreenshotInfo } from '~/types/section'
import { defineAsyncComponent, type Component } from 'vue'

// Keep component loading on client side using dynamic imports
// We use a glob import but only for the purpose of having the mapping available for defineAsyncComponent
// Nuxt/Vite handles HMR for Vue components well.
const screenDesignModules = import.meta.glob('../components/sections/*/*.vue')

/**
 * Load screen design component dynamically
 */
export function loadScreenDesignComponent(
  sectionId: string,
  screenDesignName: string
): Component | null {
  const suffix = `/components/sections/${sectionId}/${screenDesignName}.vue`
  const key = Object.keys(screenDesignModules).find(k => k.endsWith(suffix))
  
  if (!key || !screenDesignModules[key]) return null
  
  return defineAsyncComponent(screenDesignModules[key] as any)
}

/**
 * Composable to load all data for a specific section
 */
/**
 * Composable to load all data for a specific section
 */
export function useSectionData(sectionId: MaybeRefOrGetter<string>) {
  const { data, refresh, status, error } = useFetch(() => `/api/section/${toValue(sectionId)}`, {
     key: typeof sectionId === 'string' ? `section-${sectionId}` : undefined, // Let auto-key handle reactive or provide dynamic key
  })

  // Default empty structure
  const emptySectionData: SectionData = {
    sectionId: toValue(sectionId),
    spec: null,
    specParsed: null,
    data: null,
    screenDesigns: [],
    screenshots: []
  }

  const sectionData = computed<SectionData>(() => data.value?.sectionData || {
    ...emptySectionData,
    sectionId: toValue(sectionId)
  })

  return {
    sectionData,
    refresh,
    status,
    error,
    
    hasSpec: computed(() => data.value?.hasSpec ?? false),
    hasData: computed(() => data.value?.hasData ?? false),
    hasScreenDesigns: computed(() => data.value?.hasScreenDesigns ?? false),
    hasScreenshots: computed(() => data.value?.hasScreenshots ?? false)
  }
}

/**
 * Check if a section has a spec.md file
 * Note: This now requires fetching or checking the main product data which has the list.
 * Or we can expose a simple checker. 
 * For synchronous checks in templates without full data, we might need a different approach 
 * or just rely on the async useSectionData.
 */
// export function hasSectionSpec(sectionId: string): boolean {
//   // Legacy sync check not supported with server API
//   return false 
// }
