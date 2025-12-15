import type { AIAnalysisResponse } from '~/types/analyze'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Analysis data is required'
      })
    }

    const analysisData = body.data as AIAnalysisResponse
    
    if (!analysisData.results || analysisData.results.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No analysis results to export'
      })
    }

    // format JSON
    const exportData = {
      metadata: {
        export_date: new Date().toISOString(),
        total_comments: analysisData.results.length,
        export_format: 'json'
        // TODO: add AI model / region
      },
      results: analysisData.results
    }
    
    // set download headers
    setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
    setHeader(event, 'Content-Disposition', 'attachment; filename="nuha_analysis_results.json"')
    
    return JSON.stringify(exportData, null, 2)
    
  } catch (error) {
    console.error('JSON export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate JSON file'
    })
  }
})
