import * as XLSX from 'xlsx'
import { AnalysisQueue } from '~/server/utils/analysis-queue'
import { ERROR_KEYS } from '~/server/utils/input-parser'
import type { SingleResult } from '~/types/analyze'

const convertToXLSX = (results: SingleResult[]) => {
  const headers = [
    'Comment',
    'Platform',
    'Date',
    'Is Valid',
    'Main Class',
    'Sub Class',
    'Confidence',
  ]

  const data = results.map((result) => [
    result.comment || '',
    result.platform || '',
    result.date || '',
    result.is_valid ? 'Yes' : 'No',
    result.main_class || '',
    result.sub_class || '',
    typeof result.confidence === 'number'
      ? Number(result.confidence.toFixed(2))
      : '',
  ])
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])

  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 50 }, // Comment
    { wch: 15 }, // Platform
    { wch: 15 }, // Date
    { wch: 10 }, // Is Valid
    { wch: 15 }, // Main Class
    { wch: 15 }, // Sub Class
    { wch: 15 }, // Confidence
  ]
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Results')
  return XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
    codepage: 65001, // UTF-8
  })
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    let results = []

    if (!body || !body.job_id) {
      if (body?.data?.results) {
        results = body.data.results
      } else {
        throw createError({ statusCode: 400, statusMessage: 'Job ID required' })
      }
    } else {
      results = await AnalysisQueue.getAnalyzedResults(body.job_id, 0, -1)
      if (!results || results.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No analysis results to export',
        })
      }
    }

    const buffer = convertToXLSX(results)
    setHeader(
      event,
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    setHeader(
      event,
      'Content-Disposition',
      'attachment; filename="nuha_analysis_results.xlsx"'
    )

    return buffer
  } catch (error) {
    console.error('XLSX export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR,
    })
  }
})
