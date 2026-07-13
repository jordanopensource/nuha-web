import { AnalysisQueue } from '~/server/utils/analysis-queue'
import type { ResultsSort, ResultsSortField } from '~/types/analyze'

const SORT_FIELDS: ResultsSortField[] = [
  'comment',
  'platform',
  'date',
  'main_class',
  'confidence',
]

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

  let sort: ResultsSort | undefined
  const sortField = query.sort as string
  if (sortField && SORT_FIELDS.includes(sortField as ResultsSortField)) {
    sort = {
      field: sortField as ResultsSortField,
      order: query.order === 'desc' ? 'desc' : 'asc',
    }
  }

  // Redis list is 0-indexed
  const start = (page - 1) * limit
  const end = start + limit - 1

  try {
    const results = await AnalysisQueue.getAnalyzedResults(id, start, end, sort)

    return {
      success: true,
      data: {
        results,
        total: job.total_comments,
        processed: job.processed_comments,
        page,
        limit,
      },
    }
  } catch (error) {
    console.error(`Failed to fetch results for job ${id}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analysis results',
    })
  }
})
