import { ref, readonly, computed } from 'vue'
import type { ProductOverview, ProductRoadmap, Problem, Section, ProductData, DataModel, Entity, DesignSystem, ShellInfo, ShellSpec } from '@/types/product'

/**
 * Slugify a string for use as an ID
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Parse product-overview.md
 */
function parseProductOverview(md: string): ProductOverview | null {
  if (!md || !md.trim()) return null

  try {
    const nameMatch = md.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() || 'Product Overview'

    const descMatch = md.match(/## Description\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const description = descMatch?.[1]?.trim() || ''

    const problemsSection = md.match(/## Problems & Solutions\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const problems: Problem[] = []

    if (problemsSection?.[1]) {
      const problemMatches = [...problemsSection[1].matchAll(/### Problem \d+:\s*(.+)(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)### |(?:\r?\n)## |$)/g)]
      for (const match of problemMatches) {
        problems.push({
          title: match[1].trim(),
          solution: match[2].trim(),
        })
      }
    }

    const featuresSection = md.match(/## Key Features\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const features: string[] = []

    if (featuresSection?.[1]) {
      const lines = featuresSection[1].split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          features.push(trimmed.slice(2).trim())
        }
      }
    }

    if (!description && problems.length === 0 && features.length === 0) {
      return null
    }

    return { name, description, problems, features }
  } catch {
    return null
  }
}

/**
 * Parse product-roadmap.md
 */
function parseProductRoadmap(md: string): ProductRoadmap | null {
  if (!md || !md.trim()) return null

  try {
    const sections: Section[] = []
    const sectionMatches = [...md.matchAll(/### (\d+)\.\s*(.+)(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)### |(?:\r?\n)## |(?:\r?\n)#[^#]|$)/g)]

    for (const match of sectionMatches) {
      const order = parseInt(match[1], 10)
      const title = match[2].trim()
      const description = match[3].trim()

      sections.push({
        id: slugify(title),
        title,
        description,
        order,
      })
    }

    sections.sort((a, b) => a.order - b.order)

    if (sections.length === 0) return null

    return { sections }
  } catch {
    return null
  }
}

/**
 * Parse data-model.md
 */
function parseDataModel(md: string): DataModel | null {
  if (!md || !md.trim()) return null

  try {
    const entities: Entity[] = []
    const relationships: string[] = []

    const entitiesSection = md.match(/## Entities\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)

    if (entitiesSection?.[1]) {
      const entityMatches = [...entitiesSection[1].matchAll(/### ([^\n\r]+)(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)### |(?:\r?\n)## |$)/g)]
      for (const match of entityMatches) {
        entities.push({
          name: match[1].trim(),
          description: match[2].trim(),
        })
      }
    }

    const relationshipsSection = md.match(/## Relationships\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)

    if (relationshipsSection?.[1]) {
      const lines = relationshipsSection[1].split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          relationships.push(trimmed.slice(2).trim())
        }
      }
    }

    if (entities.length === 0 && relationships.length === 0) return null

    return { entities, relationships }
  } catch {
    return null
  }
}

/**
 * Parse shell spec.md
 */
function parseShellSpec(md: string): ShellSpec | null {
  if (!md || !md.trim()) return null
  try {
    const overviewMatch = md.match(/## Overview\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    const navSection = md.match(/## Navigation Structure\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const navigationItems: string[] = []

    if (navSection?.[1]) {
      const lines = navSection[1].split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          navigationItems.push(trimmed.slice(2).trim())
        }
      }
    }

    const layoutMatch = md.match(/## Layout Pattern\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const layoutPattern = layoutMatch?.[1]?.trim() || ''

    if (!overview && navigationItems.length === 0 && !layoutPattern) return null

    return { raw: md, overview, navigationItems, layoutPattern }
  } catch {
    return null
  }
}

/**
 * Main Composable
 */
export let forceExportAvailable = ref(false)

export function useProductData() {
  const productFiles = import.meta.glob('../../product/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const dataModelFiles = import.meta.glob('../../product/data-model/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const designSystemFiles = import.meta.glob('../../product/design-system/*.json', { eager: true }) as Record<string, { default: any }>
  const shellSpecFiles = import.meta.glob('../../product/shell/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const exportZipFiles = import.meta.glob('../../public/*.zip', { query: '?url', import: 'default', eager: true }) as Record<string, string>
  
  // console.log('Product Files Keys (Relative):', Object.keys(productFiles))
  // console.log('Data Model Files Keys:', Object.keys(dataModelFiles))
  // console.log('Design System Files Keys:', Object.keys(designSystemFiles))
  const screenDesignFiles = import.meta.glob('../../app/components/sections/*/*.vue', { eager: true })

  // Check for shell components
  const shellComponents = import.meta.glob('../components/shell/*.vue', { eager: true })

  // Helper to find file by suffix
  function findContent(record: Record<string, string>, suffix: string): string | null {
    const key = Object.keys(record).find(k => k.endsWith(suffix));
    return key ? record[key] : null;
  }

  // Load Product Overview
  const overviewContent = findContent(productFiles, 'product-overview.md')
  const overview = overviewContent ? parseProductOverview(overviewContent) : null

  // Load Product Roadmap
  const roadmapContent = findContent(productFiles, 'product-roadmap.md')
  const roadmap = roadmapContent ? parseProductRoadmap(roadmapContent) : null

  // Load Data Model
  const dataModelContent = findContent(dataModelFiles, '/data-model.md')
  const dataModel = dataModelContent ? parseDataModel(dataModelContent) : null

  // Load Design System
  // For JSON modules, the value is the module, not string
  function findModule(record: Record<string, { default: any }>, suffix: string): any {
    const key = Object.keys(record).find(k => k.endsWith(suffix));
    return key ? record[key] : null;
  }

  const colorsModule = findModule(designSystemFiles, '/colors.json')
  const typographyModule = findModule(designSystemFiles, '/typography.json')
  
  const colors = colorsModule?.default ? {
    primary: colorsModule.default.primary,
    secondary: colorsModule.default.secondary,
    neutral: colorsModule.default.neutral
  } : null

  const typography = typographyModule?.default ? {
    heading: typographyModule.default.heading,
    body: typographyModule.default.body,
    mono: typographyModule.default.mono || 'IBM Plex Mono'
  } : null

  const designSystem: DesignSystem | null = (colors || typography) ? { colors, typography } : null

  // Load Shell
  const shellSpecContent = findContent(shellSpecFiles, '/spec.md')
  const shellSpec = shellSpecContent ? parseShellSpec(shellSpecContent) : null
  
  // Robust check for AppShell.vue using fuzzy matching
  const hasShellComponents = Object.keys(shellComponents).some(k => k.endsWith('/AppShell.vue'))

  const shell: ShellInfo | null = (shellSpec || hasShellComponents) ? { spec: shellSpec, hasComponents: hasShellComponents } : null

  const productData: ProductData = {
    overview,
    roadmap,
    dataModel,
    designSystem,
    shell
  }

  return {
    data: productData,
    hasProductOverview: !!overview,
    hasProductRoadmap: !!roadmap,
    hasDataModel: !!dataModel,
    hasDesignSystem: !!designSystem,
    hasShell: !!shell,
    
    // Export Status
    exportZipAvailable: computed(() => forceExportAvailable.value || Object.keys(exportZipFiles).some(k => k.endsWith('/product-plan.zip'))),
    exportZipUrl: computed(() => {
      const hasZip = Object.keys(exportZipFiles).some(k => k.endsWith('/product-plan.zip'))
      return (hasZip || forceExportAvailable.value) ? '/product-plan.zip' : null
    }),
    
    // Section Statistics
    sectionStats: {
      total: roadmap?.sections.length || 0,
      withScreenDesigns: roadmap?.sections.filter(s => {
        const id = s.id
        return Object.keys(screenDesignFiles).some(k => k.includes(`/sections/${id}/`))
      }).length || 0
    }
  }
}
