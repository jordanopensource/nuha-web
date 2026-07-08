import {
  parseTextInput,
  ERROR_KEYS,
  convertToAPIRequest,
  convertFromAPIResponse,
} from '~/server/utils/input-parser'
import { detectLocale } from '~/server/utils/locale'
import type { AIAnalysisResponse, BatchClassifyResponse } from '~/types/analyze'

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
    const region = body.region || 'arz'

    // Detect user's locale for API labels, supported API languages (en, ar)
    const userLocale = detectLocale(event)
    const apiLang = userLocale

    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url

    let analysisResponse: AIAnalysisResponse
    if (aiModelUrl) {
      try {
        // convert to new API schema
        const apiRequest = convertToAPIRequest(comments)

        // TODO: update to use single text response instead, reflect in UI
        const response = await $fetch<BatchClassifyResponse>(
          `${aiModelUrl}/${region}/classify/batch`,
          {
            method: 'POST',
            body: {
              ...apiRequest,
              lang: apiLang,
            },
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
