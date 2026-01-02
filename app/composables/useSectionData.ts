import type { SectionData, ParsedSpec, ScreenDesignInfo, ScreenshotInfo } from '~/types/section'
import { defineAsyncComponent, type Component } from 'vue'

// Load spec.md files from product/sections at build time
const specFiles = import.meta.glob('../../product/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load data.json files from product/sections at build time
const dataFiles = import.meta.glob('../../product/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

// Load screen design components from app/components/sections lazily
const screenDesignModules = import.meta.glob('../components/sections/*/*.vue')
// Load screenshot files from product/sections at build time
const screenshotFiles = import.meta.glob('../../product/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Extract section ID from a product/sections file path
 * e.g., "/public/product/sections/invoices/spec.md" -> "invoices"
 */
function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product\/sections\/([^/]+)\//)
  return match?.[1] || null
}

/**
 * Extract section ID from a app/components/sections file path
 * e.g., "../components/sections/invoices/InvoiceList.vue" -> "invoices"
 */
function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/components\/sections\/([^/]+)\//)
  return match?.[1] || null
}

/**
 * Extract screen design name from a file path
 * e.g., "../components/sections/invoices/InvoiceList.vue" -> "InvoiceList"
 */
function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/components\/sections\/[^/]+\/([^/]+)\.vue$/)
  return match?.[1] || null
}

/**
 * Extract screenshot name from a file path
 * e.g., "/public/product/sections/invoices/invoice-list.png" -> "invoice-list"
 */
function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

/**
 * Parse spec.md content into ParsedSpec structure
 */
export function parseSpec(md: string): ParsedSpec | null {
  if (!md || !md.trim()) return null

  try {
    // Extract title from first # heading
    const titleMatch = md.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1]?.trim() || 'Section Specification'

    // Extract overview - content between ## Overview and next ##
    const overviewMatch = md.match(/## Overview\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    // Extract user flows - bullet list after ## User Flows
    const userFlowsSection = md.match(/## User Flows\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const userFlows: string[] = []

    if (userFlowsSection?.[1]) {
      const lines = userFlowsSection[1].split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          userFlows.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract UI requirements - bullet list after ## UI Requirements
    const uiReqSection = md.match(/## UI Requirements\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)## |(?:\r?\n)#[^#]|$)/)
    const uiRequirements: string[] = []

    if (uiReqSection?.[1]) {
      const lines = uiReqSection[1].split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          uiRequirements.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract configuration - check for shell: false
    const shellDisabled = /(?:^|\n)\s*-?\s*shell\s*:\s*false/i.test(md)
    const useShell = !shellDisabled

    return { title, overview, userFlows, uiRequirements, useShell }
  } catch {
    return null
  }
}

/**
 * Get screen designs for a specific section
 */
export function getSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const suffix = `/components/sections/${sectionId}/`

  for (const path of Object.keys(screenDesignModules)) {
    if (path.includes(suffix)) {
      const name = extractScreenDesignName(path)
      if (name) {
        screenDesigns.push({
          name,
          path,
          componentName: name,
        })
      }
    }
  }

  return screenDesigns
}

/**
 * Get screenshots for a specific section
 */
export function getSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  // Matching pattern: .../product/sections/{sectionId}/{screenshot}.png
  const suffix = `/product/sections/${sectionId}/`

  for (const [path, url] of Object.entries(screenshotFiles)) {
    // Check if path contains the section segment
    // We normalize to avoid strict prefix requirement, but ensure it belongs to this section dir
    if (path.includes(suffix)) {
      const name = extractScreenshotName(path)
      if (name) {
        screenshots.push({
          name,
          path,
          url,
        })
      }
    }
  }

  return screenshots
}

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
 * Helper to find file by suffix
 */
function findContent(record: Record<string, string>, suffix: string): string | null {
  const key = Object.keys(record).find(k => k.endsWith(suffix));
  return key ? record[key] : null;
}

/**
 * Helper to find module by suffix
 */
function findModule(record: Record<string, { default: Record<string, unknown> }>, suffix: string): Record<string, unknown> | null {
  const key = Object.keys(record).find(k => k.endsWith(suffix));
  return key && record[key] ? record[key].default : null;
}

/**
 * Composable to load all data for a specific section
 */
export function useSectionData(sectionId: string) {
  const specSuffix = `/sections/${sectionId}/spec.md`
  const dataSuffix = `/sections/${sectionId}/data.json`

  const specContent = findContent(specFiles, specSuffix)
  const data = findModule(dataFiles, dataSuffix)
  
  const sectionData: SectionData = {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getSectionScreenDesigns(sectionId),
    screenshots: getSectionScreenshots(sectionId),
  }

  return {
    sectionData,
    hasSpec: !!specContent,
    hasData: !!data,
    hasScreenDesigns: sectionData.screenDesigns.length > 0,
    hasScreenshots: sectionData.screenshots.length > 0
  }
}

/**
 * Check if a section has a spec.md file
 */
export function hasSectionSpec(sectionId: string): boolean {
  return Object.keys(specFiles).some(k => k.endsWith(`/sections/${sectionId}/spec.md`))
}

/**
 * Check if a section's screen designs should use the app shell
 */
export function sectionUsesShell(sectionId: string): boolean {
  const specSuffix = `/sections/${sectionId}/spec.md`
  const specContent = findContent(specFiles, specSuffix)
  if (!specContent) return true

  const parsed = parseSpec(specContent)
  return parsed?.useShell ?? true
}

/**
 * Check if a section has a data.json file
 */
export function hasSectionData(sectionId: string): boolean {
  return Object.keys(dataFiles).some(k => k.endsWith(`/sections/${sectionId}/data.json`))
}
