import type { EventHandler, EventHandlerRequest } from 'h3'
import * as XLSX from 'xlsx'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_BYTES, bytesToMB } from '~/utils/file-config'

// Data structure definitions
// TODO: move to types dir
export interface CommentData {
  comment: string
  platform?: string
  date?: string
}

export interface AIAnalysisRequest {
  comments: CommentData[]
  model_dialect: string
}

export interface AIAnalysisResponse {
  general_analysis: {
    hate_speech_percentage: number
    hate_speech_count: number
    hate_speech_confidence_score: number
    non_hate_speech_percentage: number
    non_hate_speech_count: number
    non_hate_speech_confidence_score: number
    model_version: string
    model_dialect: string
  }
  comments_details: Array<{
    originalComment: string
    platform?: string
    date?: string
    label: 'hate-speech' | 'non-hate-speech' | 'neutral'
    score: number
  }>
}

// Custom error class for translation
export class TranslatableError extends Error {
  public params?: Record<string, string | number>
  public key: string

  constructor(key: string, params?: Record<string, string | number>) {
    super(key)
    this.key = key
    this.params = params
    this.name = 'TranslatableError'
  }
}
export const ERROR_KEYS = {
  FILE_SIZE_EXCEEDED: 'analyze.errors.fileSizeExceeded',
  INVALID_FILE_TYPE: 'analyze.errors.invalidFileType',
  TEXT_INPUT_REQUIRED: 'analyze.validation.textRequired',
  TEXT_INPUT_EMPTY: 'analyze.errors.textInputEmpty',
  CSV_FILE_EMPTY: 'analyze.errors.csvFileEmpty',
  CSV_NO_DATA: 'analyze.errors.csvNoData',
  CSV_ROW_ERROR: 'analyze.errors.csvRowError',
  JSON_ARRAY_REQUIRED: 'analyze.errors.jsonArrayRequired',
  JSON_ITEM_ERROR: 'analyze.errors.jsonItemError',
  JSON_INVALID_FORMAT: 'analyze.errors.jsonInvalidFormat',
  EXCEL_NO_SHEETS: 'analyze.errors.excelNoSheets',
  EXCEL_EMPTY: 'analyze.errors.excelEmpty',
  EXCEL_NO_DATA: 'analyze.errors.excelNoData',
  EXCEL_ROW_ERROR: 'analyze.errors.excelRowError',
  EXCEL_PARSE_ERROR: 'analyze.errors.excelParseError',
  UNSUPPORTED_FILE_TYPE: 'analyze.errors.unsupportedFileType',
  NO_FILE_UPLOADED: 'analyze.errors.noFileUploaded',
  FILE_IS_REQUIRED: 'analyze.errors.fileIsRequired',
  PARSE_FILE_ERROR: 'analyze.errors.parseFileError',
  NO_VALID_COMMENTS: 'analyze.errors.noValidComments',
  PARSE_TEXT_ERROR: 'analyze.errors.parseTextError',
  INTERNAL_SERVER_ERROR: 'analyze.errors.internalServerError'
}

// File validation utilities
export const validateFile = (file: File, maxSizeBytes: number = MAX_FILE_SIZE_BYTES) => {
  const errors: { key: string, params?: Record<string, string | number> }[] = []
  
  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push({ 
      key: ERROR_KEYS.FILE_SIZE_EXCEEDED, 
      params: { size: bytesToMB(maxSizeBytes) }
    })
  }
  
  // Check MIME type
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    errors.push({ key: ERROR_KEYS.INVALID_FILE_TYPE })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const parseTextInput = (text: string): CommentData[] => {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '')
  
  if (lines.length === 0) {
    throw new Error(ERROR_KEYS.TEXT_INPUT_EMPTY)
  }
  
  return lines.map((line) => {
    return {
      comment: line,
    }
  })
}

// CSV parsing utilities
export const parseCsvFile = async (file: File): Promise<CommentData[]> => {
  const text = await file.text()
  const lines = text.trim().split('\n')
  
  if (lines.length === 0) {
    throw new Error(ERROR_KEYS.CSV_FILE_EMPTY)
  }
  
  // Skip header if it looks like one
  const startIndex = lines[0].toLowerCase().includes('comment') ? 1 : 0
  const dataLines = lines.slice(startIndex)
  
  if (dataLines.length === 0) {
    throw new Error(ERROR_KEYS.CSV_NO_DATA)
  }
  
  return dataLines.map((line, index) => {
    const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''))
    
    if (!parts[0]) {
      throw new TranslatableError(ERROR_KEYS.CSV_ROW_ERROR, { row: startIndex + index + 1 })
    }
    
    return {
      comment: parts[0],
      platform: parts[1] || '',
      date: parts[2] || ''
    }
  })
}

// JSON parsing utilities
// Array of objects with comment, platform, date fields
export const parseJsonFile = async (file: File): Promise<CommentData[]> => {
  const text = await file.text()
  
  try {
    const data: CommentData[] = JSON.parse(text)
    
    if (!Array.isArray(data)) {
      throw new Error(ERROR_KEYS.JSON_ARRAY_REQUIRED)
    }
    
    return data.map((item, index) => {
      if (typeof item !== 'object' || !item.comment) {
        throw new TranslatableError(ERROR_KEYS.JSON_ITEM_ERROR, { item: index + 1 })
      }
      
      return {
        comment: item.comment,
        platform: item.platform || '',
        date: item.date || ''
      }
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(ERROR_KEYS.JSON_INVALID_FORMAT)
    }
    throw error
  }
}

// Excel parsing utilities
export const parseExcelFile = async (file: File): Promise<CommentData[]> => {
  const buffer = await file.arrayBuffer()
  
  try {
    const workbook = XLSX.read(buffer)
    const sheetName = workbook.SheetNames[0]
    
    if (!sheetName) {
      throw new Error(ERROR_KEYS.EXCEL_NO_SHEETS)
    }
    
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
    
    if (jsonData.length === 0) {
      throw new Error(ERROR_KEYS.EXCEL_EMPTY)
    }
    
    // Skip header row if it exists
    const startIndex = jsonData[0] && jsonData[0][0] && 
                      jsonData[0][0].toString().toLowerCase().includes('comment') ? 1 : 0
    
    const dataRows = jsonData.slice(startIndex)
    
    if (dataRows.length === 0) {
      throw new Error(ERROR_KEYS.EXCEL_NO_DATA)
    }    
    return dataRows
    .filter(row => row.length !== 0)
    .map((row, index) => {
      if (!row[0]) {
        throw new TranslatableError(ERROR_KEYS.EXCEL_ROW_ERROR, { row: startIndex + index + 1 })
      }
      
      return {
        comment: row[0].toString(),
        platform: row[1] ? row[1].toString() : '',
        date: row[2] ? row[2].toString() : ''
      }
    })
  } catch (error) {
    if (error instanceof TranslatableError) {
      throw error
    }
    throw new Error(ERROR_KEYS.EXCEL_PARSE_ERROR)
  }
}

// main file parser
export const parseFile = async (file: File): Promise<CommentData[]> => {
  const validation = validateFile(file)
  if (!validation.isValid) {
    const first = validation.errors[0]
    throw new TranslatableError(first.key, first.params)
  }
  
  switch (file.type) {
    case 'text/plain':
    case 'text/csv':
      return await parseCsvFile(file)
    case 'application/json':
      return await parseJsonFile(file)
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await parseExcelFile(file)
    default:
      throw new TranslatableError(ERROR_KEYS.UNSUPPORTED_FILE_TYPE)
  }
}

// DEV: Mock AI response generator
export const generateMockAIResponse = (
    comments: CommentData[],
    dialect: string
  ): AIAnalysisResponse => {
  const totalComments = comments.length
  const hateSpeechCount = Math.floor(Math.random() * totalComments * 0.3) // Random 0-30%
  const nonHateSpeechCount = totalComments - hateSpeechCount
  
  return {
    general_analysis: {
      hate_speech_percentage: Math.round((hateSpeechCount / totalComments) * 100),
      hate_speech_count: hateSpeechCount,
      non_hate_speech_percentage: Math.round((nonHateSpeechCount / totalComments) * 100),
      non_hate_speech_count: nonHateSpeechCount,
      hate_speech_confidence_score: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100, // 0.7-1.0
      non_hate_speech_confidence_score: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100, // 0.7-1.0
      model_version: 'mock-v1.0.0',
      model_dialect: dialect
    },
    comments_details: comments.map(comment => ({
      originalComment: comment.comment,
      platform: comment.platform || '',
      date: comment.date || '',
      label: Math.random() > 0.7 ? 'hate-speech' : 
             Math.random() > 0.5 ? 'non-hate-speech' : 'neutral' as const,
      score: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100 // 0.6-1.0
    }))
  }
}

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async (event) => {
      try {
        const response = await handler(event)
        return { response }
      } catch (err) {
      // Error handling
        return { err }
      }
    })
