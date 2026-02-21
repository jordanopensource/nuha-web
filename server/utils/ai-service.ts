import type {
  AIAnalysisResponse,
  BatchClassifyResponse,
  CommentData,
} from '~/types/analyze'
import {
  convertFromAPIResponse,
  convertToAPIRequest,
  ERROR_KEYS,
} from '~/server/utils/input-parser'

export class AIService {
  static async analyzeBatch(
    comments: CommentData[],
    lang: string = 'ar'
  ): Promise<AIAnalysisResponse> {
    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url

    if (!aiModelUrl) {
      throw createError({
        statusCode: 503,
        statusMessage: 'AI analysis service not configured',
      })
    }

    try {
      const apiRequest = convertToAPIRequest(comments)

      const response = await $fetch<BatchClassifyResponse>(
        `${aiModelUrl}/classify/batch?lang=${lang}`,
        {
          method: 'POST',
          body: apiRequest,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return convertFromAPIResponse(response, comments)
    } catch (error) {
      console.error('AI Analysis API Error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
