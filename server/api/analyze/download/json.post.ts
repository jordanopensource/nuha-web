import { AnalysisQueue } from '~/server/utils/analysis-queue'
import { ERROR_KEYS } from '~/server/utils/input-parser'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.job_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Job ID is required',
      })
    }

    // Fetch all results (-1 means up to end)
    const results = await AnalysisQueue.getAnalyzedResults(body.job_id, 0, -1)
    const metadata = await AnalysisQueue.getOverview(body.job_id)

    console.log(
      'Exporting analysis results for job:',
      body.job_id,
      'with metadata:',
      metadata
    )

    if (!results || results.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No analysis results to export',
      })
    }

    const exportData = {
      metadata: {
        id: body.job_id,
        analysis_date: metadata?.job.created_at || 'unknown',
        export_date: new Date().toISOString(),
        total_comments: metadata?.job.total_comments,
        analyzed_comments: metadata?.job.processed_comments || results.length,
        dialect: metadata?.job.dialect || 'unknown',
        lang: metadata?.job.lang || 'unknown',
      },
      results: results,
    }

    return {
      ...exportData,
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
