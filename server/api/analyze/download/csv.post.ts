import type { AIAnalysisResponse } from '~/types/analyze'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || !body.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Analysis data is required',
      })
    }

    const analysisData = body.data as AIAnalysisResponse
    const results = analysisData.results

    if (!results || results.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No analysis results to export',
      })
    }

    // generate csv content
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

    const csvContent = csvRows.join('\n')

    // set headers for file download
    setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
    setHeader(
      event,
      'Content-Disposition',
      'attachment; filename="nuha_analysis_results.csv"'
    )

    // add BOM to support utf-8 in excel
    return '\uFEFF' + csvContent
  } catch (error) {
    console.error('CSV export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate CSV file',
    })
  }
})
