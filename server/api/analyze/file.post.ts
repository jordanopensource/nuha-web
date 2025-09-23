import { parseFile, generateMockAIResponse } from '~/server/utils/input-parser'
import type { AIAnalysisRequest, AIAnalysisResponse } from '~/server/utils/input-parser'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    // TODO: translate user errors
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }
    
    // TODO: translate errors
    // find the file in form data
    const fileEntry = formData.find(entry => entry.name === 'file')
    if (!fileEntry || !fileEntry.data || !fileEntry.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File is required'
      })
    }
    
    // create a file-like object from the uploaded data
    const file = new File([new Uint8Array(fileEntry.data)], fileEntry.filename, {
      type: fileEntry.type || 'application/octet-stream'
    })
    
    // parse file content
    let comments
    try {
      comments = await parseFile(file)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error instanceof Error ? error.message : 'Failed to parse file'
      })
    }
    
    // make sure we have comments
    if (!comments || comments.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid comments found in file'
      })
    }
    
    // prepare data for AI analysis
    const analysisRequest: AIAnalysisRequest = {
      comments,
      model_dialect: 'egy' // FIXME: get region from req
    }
    
    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url
    
    let analysisResponse: AIAnalysisResponse
    
    if (aiModelUrl) {
      // Send to actual AI endpoint
      try {
        const response = await $fetch<AIAnalysisResponse>(aiModelUrl, {
          method: 'POST',
          body: analysisRequest,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        analysisResponse = response
      } catch (error) {
        console.error('AI Analysis API Error:', error)
        // DEV: fallback to mock data if AI API fails
        // FIXME: get region from req
        analysisResponse = generateMockAIResponse(comments, 'egy')
      }
    } else {
      // DEV: use mock data when AI URL is not configured
      // FIXME: get region from req
      analysisResponse = generateMockAIResponse(comments, 'egy')
    }
    
    return {
      success: true,
      data: analysisResponse
    }
    
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
