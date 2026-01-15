import type { EventHandler, EventHandlerRequest } from 'h3'
import * as XLSX from 'xlsx'
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  bytesToMB,
} from '~/utils/file-config'
import type {
  CommentData,
  AIAnalysisResponse,
  BatchClassifyResponse,
  ClassificationResult,
} from '~/types/analyze'

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
  INTERNAL_SERVER_ERROR: 'analyze.errors.internalServerError',
}

// File validation utilities
export const validateFile = (
  file: File,
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES
) => {
  const errors: { key: string; params?: Record<string, string | number> }[] = []

  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push({
      key: ERROR_KEYS.FILE_SIZE_EXCEEDED,
      params: { size: bytesToMB(maxSizeBytes) },
    })
  }

  // Check MIME type
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    errors.push({ key: ERROR_KEYS.INVALID_FILE_TYPE })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const parseTextInput = (text: string): CommentData[] => {
  const inputText = text.trim()
  if (inputText.length === 0) {
    throw new Error(ERROR_KEYS.TEXT_INPUT_EMPTY)
  }

  return [{ comment: inputText }]
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

  return dataLines.map((line, _index) => {
    const parts = line
      .split(',')
      .map((part) => part.trim().replace(/^"|"$/g, ''))

    if (!parts[0]) {
      // throw new TranslatableError(ERROR_KEYS.CSV_ROW_ERROR, { row: startIndex + index + 1 })
      return {
        comment: null,
      }
    }

    return {
      comment: parts[0],
      platform: parts[1] || '',
      date: parts[2] || '',
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

    return data.map((item, _index) => {
      if (typeof item !== 'object' || !item.comment) {
        // throw new TranslatableError(ERROR_KEYS.JSON_ITEM_ERROR, { item: index + 1 })
        return {
          comment: null,
        }
      }

      return {
        comment: item.comment,
        platform: item.platform || '',
        date: item.date || '',
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
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][]

    if (jsonData.length === 0) {
      throw new Error(ERROR_KEYS.EXCEL_EMPTY)
    }

    // Skip header row if it exists
    const startIndex =
      jsonData[0] &&
      jsonData[0][0] &&
      jsonData[0][0].toString().toLowerCase().includes('comment')
        ? 1
        : 0

    const dataRows = jsonData.slice(startIndex)

    if (dataRows.length === 0) {
      throw new Error(ERROR_KEYS.EXCEL_NO_DATA)
    }
    return dataRows
      .filter((row) => row.length !== 0)
      .map((row, _index) => {
        if (!row[0]) {
          // throw new TranslatableError(ERROR_KEYS.EXCEL_ROW_ERROR, { row: startIndex + index + 1 })
          return {
            comment: null,
          }
        }

        return {
          comment: row[0].toString(),
          platform: row[1] ? row[1].toString() : '',
          date: row[2] ? row[2].toString() : '',
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

// convert AIAnalysisRequest to new API BatchClassifyRequest
export const convertToAPIRequest = (comments: CommentData[]) => {
  return {
    texts: comments.filter((c) => c.comment !== null).map((c) => c.comment),
  }
}

// convert new API BatchClassifyResponse to AIAnalysisResponse
export const convertFromAPIResponse = (
  apiResponse: BatchClassifyResponse,
  originalComments: CommentData[]
): AIAnalysisResponse => {
  return {
    results: apiResponse.results.map(
      (result: ClassificationResult, i: number) => ({
        originalComment: originalComments[i].comment!,
        platform: originalComments[i]?.platform,
        date: originalComments[i]?.date,
        is_valid: result.is_valid,
        main_class: result.main_class,
        sub_class: result.sub_class,
        confidence: result.confidence,
      })
    ),
  }
}

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
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
