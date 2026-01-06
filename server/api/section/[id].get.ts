import fs from 'node:fs'
import path from 'node:path'
import type { SectionData, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'

export default defineEventHandler((event) => {
  const sectionId = getRouterParam(event, 'id')
  if (!sectionId) {
    throw createError({ statusCode: 400, statusMessage: 'Section ID required' })
  }

  const rootDir = process.cwd()
  const productSectionDir = path.join(rootDir, 'product/sections', sectionId)
  const appSectionDir = path.join(rootDir, 'app/components/sections', sectionId)
  
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

  // Load spec.md
  // Try both product/sections/[id]/spec.md
  const specPath = path.join(productSectionDir, 'spec.md')
  const specContent = readFile(specPath)
  const specParsed = specContent ? parseSpec(specContent) : null

  // Load data.json
  const dataPath = path.join(productSectionDir, 'data.json')
  const dataContent = readFile(dataPath)
  const data = dataContent ? JSON.parse(dataContent) : null

  // Scan for Screen Designs (Vue components)
  const screenDesigns: ScreenDesignInfo[] = []
  try {
    if (fs.existsSync(appSectionDir)) {
      const files = fs.readdirSync(appSectionDir)
      for (const file of files) {
        if (file.endsWith('.vue')) {
          const name = file.replace('.vue', '')
          // Path used by client to identify/load
          const componentPath = `/components/sections/${sectionId}/${file}` 
          screenDesigns.push({
            name,
            path: componentPath,
            componentName: name
          })
        }
      }
    }
  } catch {}

  // Scan for Screenshots (images in product folder)
  const screenshots: ScreenshotInfo[] = []
  try {
    if (fs.existsSync(productSectionDir)) {
      const files = fs.readdirSync(productSectionDir)
      for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
          const name = file.replace(/\.(png|jpg|jpeg)$/, '')
          const url = `/_product_images/${sectionId}/${file}` // We might need a middleware to serve these if they aren't in public
          // Actually, earlier assumption was they are in public/product.
          // IF product is at root, we need a server route to serve images OR copy them to public.
          // For now, let's assume they are handled or we'll add an image serving route later.
          // Wait, simple solution: server route to read image and return it.
          // But for now just returning the list.
          
          screenshots.push({
            name,
            path: `/product/sections/${sectionId}/${file}`,
            url: `/api/product/image/${sectionId}/${file}` // Let's use an API route for images to be safe
          })
        }
      }
    }
  } catch {}

  const sectionData: SectionData = {
    sectionId,
    spec: specContent,
    specParsed,
    data,
    screenDesigns,
    screenshots
  }

  return {
    sectionData,
    hasSpec: !!specContent,
    hasData: !!data,
    hasScreenDesigns: screenDesigns.length > 0,
    hasScreenshots: screenshots.length > 0
  }
})
