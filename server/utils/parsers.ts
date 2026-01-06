import type { ProductOverview, ProductRoadmap, Problem, Section, DataModel, Entity, ShellSpec } from '@/types/product'

/**
 * Slugify a string for use as an ID
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Parse product-overview.md
 */
export function parseProductOverview(md: string): ProductOverview | null {
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
export function parseProductRoadmap(md: string): ProductRoadmap | null {
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
export function parseDataModel(md: string): DataModel | null {
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
export function parseShellSpec(md: string): ShellSpec | null {
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
 * Parse spec.md content into ParsedSpec structure
 */
export function parseSpec(md: string) {
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
