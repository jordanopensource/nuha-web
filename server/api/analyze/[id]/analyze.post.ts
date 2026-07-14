import { AnalysisQueue } from '~/server/utils/analysis-queue'
import { AIService } from '~/server/utils/ai-service'
import { ERROR_KEYS } from '~/server/utils/input-parser'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Analysis ID is required',
    })
  }

  // check job exists
  const job = await AnalysisQueue.getJob(id)
  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Analysis job not found',
    })
  }

  // get first N comments
  const comments = await AnalysisQueue.getComments(id, 0, limit - 1)

  if (comments.length === 0) {
    return {
      success: true,
      data: {
        results: [],
        job,
      },
    }
  }

  // analyze first N comments, save results and update progress
  let analysisResponse
  try {
    analysisResponse = await AIService.analyzeBatch(
      comments,
      job.lang,
      job.dialect
    )

    await AnalysisQueue.saveResults(id, analysisResponse.results)
    await AnalysisQueue.updateJobStatus(
      id,
      'processing',
      analysisResponse.results.length
    )
  } catch (error) {
    console.error(`Initial batch analysis failed for job ${id}:`, error)

    await AnalysisQueue.updateJobStatus(id, 'failed').catch((statusErr) =>
      console.error(`Failed to mark job ${id} as failed:`, statusErr)
    )

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
    })
  }

  // trigger background full analysis
  AnalysisQueue.processJob(id).catch((err) =>
    console.error('Background job launch failed:', err)
  )

  return {
    success: true,
    data: {
      ...analysisResponse,
      job,
    },
  }
})
