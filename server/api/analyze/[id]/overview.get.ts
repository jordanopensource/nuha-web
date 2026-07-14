import { AnalysisQueue } from '~/server/utils/analysis-queue'
import type { AnalysisOverview } from '~/types/analyze'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Analysis ID is required',
    })
  }

  const overview: AnalysisOverview | null = await AnalysisQueue.getOverview(id)

  if (!overview) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Analysis job not found',
    })
  }

  return {
    success: true,
    data: overview
  }
})
