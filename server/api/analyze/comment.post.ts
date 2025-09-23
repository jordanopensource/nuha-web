import { parseTextInput, generateMockAIResponse, ERROR_KEYS } from '~/server/utils/input-parser'
import type { AIAnalysisRequest, AIAnalysisResponse } from '~/server/utils/input-parser'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.text) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.TEXT_INPUT_REQUIRED
      })
    }

    const text = body.text.trim()
    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.TEXT_INPUT_EMPTY
      })
    }
    
    // Parse text input
    let comments
    try {
      comments = parseTextInput(text)
    } catch (error) {
      const msg = error instanceof Error ? error.message : ERROR_KEYS.PARSE_TEXT_ERROR
      throw createError({
        statusCode: 400,
        statusMessage: msg
      })
    }
    
    // Get region
    const region = body.region || 'egy'
    
    // Prepare data for AI analysis
    const analysisRequest: AIAnalysisRequest = {
      comments,
      model_dialect: region
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
        analysisResponse = generateMockAIResponse(comments, region)
      }
    } else {
      // DEV: use mock data when AI URL is not configured
      analysisResponse = generateMockAIResponse(comments, region)
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
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR
    })
  }
})
