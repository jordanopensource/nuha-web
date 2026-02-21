import {
  parseTextInput,
  ERROR_KEYS,
} from '~/server/utils/input-parser'
import { detectLocale } from '~/server/utils/locale'
import { AnalysisQueue } from '~/server/utils/analysis-queue'

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

    // Detect locale
    const userLocale = detectLocale(event)
    const lang = userLocale === 'ar' ? 'ar' : 'en'

    // Create analysis job
    const job = await AnalysisQueue.createJob(comments, _region, lang)

    return {
      success: true,
      data: {
        analysis_id: job.analysis_id,
        total_comments: job.total_comments
      },
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
