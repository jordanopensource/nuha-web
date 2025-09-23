import { parseTextInput, generateMockAIResponse } from '~/server/utils/input-parser'
import type { AIAnalysisRequest, AIAnalysisResponse } from '~/server/utils/input-parser'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // TODO: translate user errors
    if (!body || !body.text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text input is required'
      })
    }

    const text = body.text.trim()
    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text input cannot be empty'
      })
    }
    
    // Parse text input
    let comments
    try {
      comments = parseTextInput(text)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error instanceof Error ? error.message : 'Failed to parse text input'
      })
    }
    
    // Prepare data for AI analysis
    const analysisRequest: AIAnalysisRequest = {
      comments,
      model_dialect: 'egy' // FIXME: get region from req
    }
    
    // Check if AI analysis URL is configured
    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url
    
    let analysisResponse: AIAnalysisResponse
    
    if (aiModelUrl) {
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
      // DEV: fallback to mock data if AI API fails
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
