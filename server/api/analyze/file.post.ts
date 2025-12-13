import { parseFile, ERROR_KEYS, TranslatableError, convertToAPIRequest, convertFromAPIResponse } from '~/server/utils/input-parser'
import type { AIAnalysisRequest, AIAnalysisResponse, BatchClassifyResponse } from '~/types/analyze'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.NO_FILE_UPLOADED
      })
    }
    
    // find the file in form data
    const fileEntry = formData.find(entry => entry.name === 'file')
    if (!fileEntry || !fileEntry.data || !fileEntry.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.FILE_IS_REQUIRED
      })
    }
    
    // create a file-like object from the uploaded data
    const file = new File([new Uint8Array(fileEntry.data)], fileEntry.filename, {
      type: fileEntry.type || 'application/octet-stream'
    })
    
    // parse file content
    let comments
    try {
      comments = await parseFile(file)
    } catch (error) {
      if (error instanceof TranslatableError) {
        const err = createError({
          statusCode: 400,
          statusMessage: error.key,
          data: { params: error.params }
        })
        throw err
      }
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.PARSE_FILE_ERROR
      })
    }
    
    // make sure we have comments
    if (!comments || comments.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: ERROR_KEYS.NO_VALID_COMMENTS
      })
    }
    
    // Get region from form data
    const regionEntry = formData.find(entry => entry.name === 'region')

    // NOTE: to be updated once the API supports different models
    const _region = regionEntry?.data ? new TextDecoder().decode(regionEntry.data) : 'egy'
    
    // prepare data for AI analysis
    const _analysisRequest: AIAnalysisRequest = {
      comments,
      // model_dialect: region
    }
    
    const config = useRuntimeConfig()
    const aiModelUrl = config.aiModel?.url
    
    let analysisResponse: AIAnalysisResponse
    
    if (aiModelUrl) {
      try {
        const apiRequest = convertToAPIRequest(comments)

        const response = await $fetch<BatchClassifyResponse>(`${aiModelUrl}/classify/batch`, {
          method: 'POST',
          body: apiRequest,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        analysisResponse = convertFromAPIResponse(response, comments)
      } catch (error) {
        console.error('AI Analysis API Error:', error)
        throw createError({
          statusCode: 500,
          statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR
        })
      }
    } else {
      throw createError({
        statusCode: 503,
        statusMessage: 'AI analysis service not configured'
        // TODO: i18n
      })
    }
    
    return {
      success: true,
      data: analysisResponse
    }
    
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: ERROR_KEYS.INTERNAL_SERVER_ERROR
    })
  }
})
