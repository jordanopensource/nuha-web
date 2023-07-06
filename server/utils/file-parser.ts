import { parse } from 'csv-parse/sync'
import { SingleComment } from '../../types'

export interface FileParser {
  parseFile(file: Buffer): Promise<SingleComment[]>
}

export enum FileType {
  CSV = 'csv',
  XLSX = 'xlsx',
  INVALID = 'invalid',
}

export function getFileType(fileTypeText: string): FileType {
  switch (fileTypeText.toLowerCase()) {
    case 'xlsx':
      return FileType.XLSX
    case 'csv':
      return FileType.CSV
    default:
      return FileType.INVALID
  }
}

export async function getFileParser(fileType: FileType): Promise<FileParser> {
  switch (fileType) {
    case FileType.CSV:
      return resolve(CsvFileParser.instance)
    case FileType.XLSX:
      return resolve(XlsxFileParser.instance)
    default:
      return reject('invalid file type')
  }
}

class CsvFileParser implements FileParser {
  private static _instance = new CsvFileParser()

  private constructor() {}

  static get instance(): CsvFileParser {
    return CsvFileParser._instance
  }

  async parseFile(file: Buffer): Promise<SingleComment[]> {
    const data = new Array<SingleComment>()
    const records = parse(file, {
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (!records) {
      return reject('invalid input data.')
    }

    let recordKeys: string[]
    for (const record of records) {
      recordKeys = Object.keys(record)
      if (!recordKeys.includes('comment')) {
        return reject('missing column `comment`.')
      }
      if (!recordKeys.includes('post')) {
        return reject('missing column `post`.')
      }
      data.push({
        comment: record.comment,
        post: record.post,
      })
    }

    return data
  }
}

class XlsxFileParser implements FileParser {
  private static _instance = new XlsxFileParser()

  private constructor() {}

  static get instance(): XlsxFileParser {
    return XlsxFileParser._instance
  }

  async parseFile(file: Buffer): Promise<SingleComment[]> {
    return new Array({ comment: '', post: '' })
  }
}
