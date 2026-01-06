import type { ProductData } from '@/types/product'

/**
 * Main Composable
 */
export let forceExportAvailable = ref(false)

export function useProductData() {
  const { data, refresh, status, error } = useFetch('/api/product', {
    // Only fetch on client or during hydration
    // Use lazy/server: false if we want it strictly client side updating? 
    // Default is hybrid.
    watch: [forceExportAvailable], // re-fetch if we force export availability
  })
  
  // Expose computed properties for easy access
  const productData = computed<ProductData>(() => data.value?.data || {
    overview: null,
    roadmap: null,
    dataModel: null,
    designSystem: null,
    shell: null,
    sectionProgress: {}
  })

  return {
    data: productData,
    refresh,
    status,
    error,
    
    // Computed flags based on the fetched data
    hasProductOverview: computed(() => data.value?.hasProductOverview ?? false),
    hasProductRoadmap: computed(() => data.value?.hasProductRoadmap ?? false),
    hasDataModel: computed(() => data.value?.hasDataModel ?? false),
    hasDesignSystem: computed(() => data.value?.hasDesignSystem ?? false),
    hasShell: computed(() => data.value?.hasShell ?? false),
    
    // Export Status
    exportZipAvailable: computed(() => forceExportAvailable.value || !!data.value?.exportZipUrl),
    exportZipUrl: computed(() => (data.value?.exportZipUrl || (forceExportAvailable.value ? '/product-plan.zip' : null))),
    
    // Section Statistics
    sectionStats: computed(() => data.value?.sectionStats || { total: 0, withScreenDesigns: 0 })
  }
}
