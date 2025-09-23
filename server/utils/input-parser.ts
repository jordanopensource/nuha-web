import type { EventHandler, EventHandlerRequest } from 'h3'
import * as XLSX from 'xlsx'

// TODO: Translate all errors
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

// File validation utilities
export const validateFile = (file: File, maxSizeBytes: number = 10 * 1024 * 1024) => {
  const errors: string[] = []
  
  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds maximum limit of ${Math.round(maxSizeBytes / 1024 / 1024)}MB`)
  }
  
  // Check MIME type
  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/json',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload a text, CSV, JSON, or Excel file')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const parseTextInput = (text: string): CommentData[] => {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '')
  
  if (lines.length === 0) {
    throw new Error('Text input is empty')
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
    throw new Error('CSV file is empty')
  }
  
  // Skip header if it looks like one
  const startIndex = lines[0].toLowerCase().includes('comment') ? 1 : 0
  const dataLines = lines.slice(startIndex)
  
  if (dataLines.length === 0) {
    throw new Error('CSV file contains no data')
  }
  
  return dataLines.map((line, index) => {
    const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''))
    
    if (!parts[0]) {
      throw new Error(`Row ${startIndex + index + 1}: Comment is required`)
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
      throw new Error('JSON file must contain an array of objects')
    }
    
    return data.map((item, index) => {
      if (typeof item !== 'object' || !item.comment) {
        throw new Error(`Item ${index + 1}: Comment is required`)
      }
      
      return {
        comment: item.comment,
        platform: item.platform || '',
        date: item.date || ''
      }
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format')
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
      throw new Error('Excel file contains no sheets')
    }
    
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty')
    }
    
    // Skip header row if it exists
    const startIndex = jsonData[0] && jsonData[0][0] && 
                      jsonData[0][0].toString().toLowerCase().includes('comment') ? 1 : 0
    
    const dataRows = jsonData.slice(startIndex)
    
    if (dataRows.length === 0) {
      throw new Error('Excel file contains no data')
    }    
    return dataRows
    .filter(row => row.length !== 0)
    .map((row, index) => {
      if (!row[0]) {
        throw new Error(`Row ${startIndex + index + 1}: Comment is required`)
      }
      
      return {
        comment: row[0].toString(),
        platform: row[1] ? row[1].toString() : '',
        date: row[2] ? row[2].toString() : ''
      }
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Row')) {
      throw error
    }
    throw new Error('Failed to parse Excel file')
  }
}

// main file parser
export const parseFile = async (file: File): Promise<CommentData[]> => {
  const validation = validateFile(file)
  if (!validation.isValid) {
    throw new Error(validation.errors.join('; '))
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
      throw new Error('Unsupported file type')
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
