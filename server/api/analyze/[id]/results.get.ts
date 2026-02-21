import { AnalysisQueue } from '~/server/utils/analysis-queue'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Analysis ID is required',
    })
  }

  const job = await AnalysisQueue.getJob(id)
  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Analysis job not found',
    })
  }

  // Redis list is 0-indexed
  const start = (page - 1) * limit
  const end = start + limit - 1

  const results = await AnalysisQueue.getAnalyzedResults(id, start, end)

  return {
    success: true,
    data: {
      results,
      total: job.total_comments,
      processed: job.processed_comments,
      page,
      limit
    }
  }
})
