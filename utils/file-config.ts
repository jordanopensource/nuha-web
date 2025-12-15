export type AllowedFileType = {
  mime: string
  labelKey: string // i18n key for human-readable name
  extensions: string[]
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export const ALLOWED_FILE_TYPES: AllowedFileType[] = [
  {
    mime: 'text/plain',
    labelKey: 'analyze.fileTypes.plainText',
    extensions: ['.txt'],
  },
  {
    mime: 'text/csv',
    labelKey: 'analyze.fileTypes.csv',
    extensions: ['.csv'],
  },
  {
    mime: 'application/json',
    labelKey: 'analyze.fileTypes.json',
    extensions: ['.json'],
  },
  {
    mime: 'application/vnd.ms-excel', // .xls
    labelKey: 'analyze.fileTypes.excelXls',
    extensions: ['.xls'],
  },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    labelKey: 'analyze.fileTypes.excelXlsx',
    extensions: ['.xlsx'],
  },
]

export const ACCEPTED_MIME_TYPES = ALLOWED_FILE_TYPES.map((t) => t.mime)
export const ACCEPTED_EXTENSIONS = ALLOWED_FILE_TYPES.flatMap(
  (t) => t.extensions
)

export const bytesToMB = (bytes: number) => Math.round(bytes / 1024 / 1024)
