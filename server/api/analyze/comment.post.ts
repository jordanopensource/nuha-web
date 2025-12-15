import {
  parseTextInput,
  ERROR_KEYS,
  convertToAPIRequest,
  convertFromAPIResponse,
} from '~/server/utils/input-parser'
import { detectLocale } from '~/server/utils/locale'
import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  BatchClassifyResponse,
} from '~/types/analyze'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.text) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.TEXT_INPUT_REQUIRED,
      })
    }

    const text = body.text.trim()
    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.TEXT_INPUT_EMPTY,
      })
    }

    // Parse text input
    let comments
    try {
      comments = parseTextInput(text)
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : ERROR_KEYS.PARSE_TEXT_ERROR
      throw createError({
        statusCode: 400,
        statusMessage: msg,
      })
    }

    // Get region
    // NOTE: to be updated once the API supports different models
    const _region = body.region || 'egy'

    // Detect user's locale for API labels, supported API languages (en, ar)
    const userLocale = detectLocale(event)
    const apiLang = userLocale === 'ar' ? 'ar' : 'en'

    // Prepare data for AI analysis
    const _analysisRequest: AIAnalysisRequest = {
      comments,
      // model_dialect: region
    }

    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url

    let analysisResponse: AIAnalysisResponse
    if (aiModelUrl) {
      try {
        // convert to new API schema
        const apiRequest = convertToAPIRequest(comments)

        // TODO: update to use single text response instead, reflect in UI
        const response = await $fetch<BatchClassifyResponse>(
          `${aiModelUrl}/classify/batch?lang=${apiLang}`,
          {
            method: 'POST',
            body: apiRequest,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        // convert back to frontend schema
        analysisResponse = convertFromAPIResponse(response, comments)
      } catch (error) {
        console.error('AI Analysis API Error:', error)
        throw createError({
          statusCode: 500,
          statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
        })
      }
    } else {
      throw createError({
        statusCode: 503,
        statusMessage: 'AI analysis service not configured',
        // TODO: add translatable error key for this error
      })
    }

    return {
      success: true,
      data: analysisResponse,
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
    })
  }
})
