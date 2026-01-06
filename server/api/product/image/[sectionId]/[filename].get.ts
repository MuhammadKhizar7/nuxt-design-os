import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const sectionId = getRouterParam(event, 'sectionId')
  const filename = getRouterParam(event, 'filename')
  
  if (!sectionId || !filename) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  // Prevent directory traversal
  const safeSectionId = sectionId.replace(/[^a-zA-Z0-9-_]/g, '')
  const safeFilename = filename.replace(/[^a-zA-Z0-9-_\.]/g, '')

  const filePath = path.join(process.cwd(), 'product/sections', safeSectionId, safeFilename)

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }

  // Serve the file
  return sendStream(event, fs.createReadStream(filePath))
})
