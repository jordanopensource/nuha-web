import { AnalysisQueue } from '~/server/utils/analysis-queue'
import { ERROR_KEYS } from '~/server/utils/input-parser'
import type { SingleResult } from '~/types/analyze'

const convertToCSV = (results: SingleResult[]) => {
  const headers = [
    'Comment',
    'Platform',
    'Date',
    'Is Valid',
    'Main Class',
    'Sub Class',
    'Confidence',
  ]
  const csvRows = [
    headers.join(','),
    ...results.map((result) =>
      [
        `"${(result.comment || '').replace(/"/g, '""')}"`, // Escape quotes and handle null
        `"${result.platform || ''}"`,
        `"${result.date || ''}"`,
        result.is_valid ? 'Yes' : 'No',
        `"${result.main_class || ''}"`,
        `"${result.sub_class || ''}"`,
        typeof result.confidence === 'number'
          ? result.confidence.toFixed(2)
          : '',
      ].join(',')
    ),
  ]

  return csvRows.join('\n')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.job_id) {
      if (body?.data) return convertToCSV(body.data.results)
      throw createError({ statusCode: 400, statusMessage: 'Job ID required' })
    }

    const results = await AnalysisQueue.getAnalyzedResults(body.job_id, 0, -1)

    setHeader(event, 'Content-Type', 'text/csv;charset=utf-8')
    setHeader(
      event,
      'Content-Disposition',
      'attachment; filename="nuha_analysis_results.csv"'
    )

    const csvContent = convertToCSV(results)
    // add BOM to support utf-8 in excel
    return '\uFEFF' + csvContent
  } catch (error) {
    console.error('CSV export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
    })
  }
})
