import fs from 'node:fs'
import path from 'node:path'
import type { ProductData, DesignSystem, ShellInfo } from '@/types/product'

export default defineEventHandler((event) => {
  const rootDir = process.cwd()
  const productDir = path.join(rootDir, 'product')
  
  // Helper to safely read file
  const readFile = (filePath: string): string | null => {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8')
      }
      return null
    } catch {
      return null
    }
  }

  // Helper to safely read JSON
  const readJson = (filePath: string): any | null => {
    const content = readFile(filePath)
    if (!content) return null
    try {
      return JSON.parse(content)
    } catch {
      return null
    }
  }

  // Load Product Overview
  const overviewContent = readFile(path.join(productDir, 'product-overview.md'))
  const overview = overviewContent ? parseProductOverview(overviewContent) : null

  // Load Product Roadmap
  const roadmapContent = readFile(path.join(productDir, 'product-roadmap.md'))
  const roadmap = roadmapContent ? parseProductRoadmap(roadmapContent) : null

  // Load Data Model
  const dataModelContent = readFile(path.join(productDir, 'data-model/data-model.md'))
  const dataModel = dataModelContent ? parseDataModel(dataModelContent) : null

  // Load Design System
  const colorsJson = readJson(path.join(productDir, 'design-system/colors.json'))
  const typographyJson = readJson(path.join(productDir, 'design-system/typography.json'))

  const colors = colorsJson ? {
    primary: colorsJson.primary,
    secondary: colorsJson.secondary,
    neutral: colorsJson.neutral
  } : null

  const typography = typographyJson ? {
    heading: typographyJson.heading,
    body: typographyJson.body,
    mono: typographyJson.mono || 'IBM Plex Mono'
  } : null

  const designSystem: DesignSystem | null = (colors || typography) ? { colors, typography } : null

  // Load Shell
  const shellSpecContent = readFile(path.join(productDir, 'shell/spec.md'))
  const shellSpec = shellSpecContent ? parseShellSpec(shellSpecContent) : null

  // Check for shell components
  // Note: On server side we verify existence of the directory
  const shellComponentsDir = path.join(rootDir, 'app/components/shell')
  let hasShellComponents = false
  try {
    if (fs.existsSync(shellComponentsDir)) {
      const files = fs.readdirSync(shellComponentsDir)
      hasShellComponents = files.some(f => f === 'AppShell.vue')
    }
  } catch {}

  const shell: ShellInfo | null = (shellSpec || hasShellComponents) ? { spec: shellSpec, hasComponents: hasShellComponents } : null

  const productData: ProductData = {
    overview,
    roadmap,
    dataModel,
    designSystem,
    shell
  }

  // Check stats and progress
  const sectionsDir = path.join(rootDir, 'app/components/sections')
  const sectionsProductDir = path.join(rootDir, 'product/sections')
  
  let sectionStats = { total: roadmap?.sections.length || 0, withScreenDesigns: 0 }
  const sectionProgress: Record<string, import('@/types/product').SectionProgress> = {}
  
  if (roadmap?.sections) {
    try {
      const existingSectionsInApp = fs.existsSync(sectionsDir) ? fs.readdirSync(sectionsDir) : []
      const existingSectionsInProduct = fs.existsSync(sectionsProductDir) ? fs.readdirSync(sectionsProductDir) : []
      
      sectionStats.withScreenDesigns = 0

      for (const section of roadmap.sections) {
        const id = section.id
        const sectionAppDir = path.join(sectionsDir, id)
        const sectionProductDir = path.join(sectionsProductDir, id)
        
        let screenDesignCount = 0
        let screenshotCount = 0
        let hasSpec = false
        let hasData = false

        // Check App Components
        if (existingSectionsInApp.includes(id) && fs.existsSync(sectionAppDir)) {
          const files = fs.readdirSync(sectionAppDir)
          screenDesignCount = files.filter(f => f.endsWith('.vue')).length
        }

        // Check Product Data
        if (existingSectionsInProduct.includes(id) && fs.existsSync(sectionProductDir)) {
          const files = fs.readdirSync(sectionProductDir)
          hasSpec = files.includes('spec.md')
          hasData = files.includes('data.json')
          screenshotCount = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')).length
        }

        if (screenDesignCount > 0) {
          sectionStats.withScreenDesigns++
        }

        sectionProgress[id] = {
          hasSpec,
          hasData,
          hasScreenDesigns: screenDesignCount > 0,
          screenDesignCount,
          hasScreenshots: screenshotCount > 0,
          screenshotCount
        }
      }
    } catch {}
  }
  
  // Check exports - looking for .zip files in public/
  const publicDir = path.join(rootDir, 'public')
  let exportZipUrl: string | null = null
  try {
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir)
      if (files.some(f => f === 'product-plan.zip')) {
        exportZipUrl = '/product-plan.zip'
      }
    }
  } catch {}

  const finalProductData: ProductData = {
    overview,
    roadmap,
    dataModel,
    designSystem,
    shell,
    sectionProgress
  }

  return {
    data: finalProductData,
    hasProductOverview: !!overview,
    hasProductRoadmap: !!roadmap,
    hasDataModel: !!dataModel,
    hasDesignSystem: !!designSystem,
    hasShell: !!shell,
    exportZipUrl,
    sectionStats
  }
})
