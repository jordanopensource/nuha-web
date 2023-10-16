import {parse} from 'csv-parse/sync'
import xlsx from 'node-xlsx'

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
    return FileType.XLSX;
  case 'csv':
    return FileType.CSV;
  default:
    return FileType.INVALID
  }
}

export async function getFileParser(fileType: FileType): Promise<FileParser> {
  switch (fileType) {
  case FileType.CSV:
    return resolve(CsvFileParser.instance);
  case FileType.XLSX:
    return resolve(XlsxFileParser.instance);
  default:
    return reject('apiResponse.invalidFileType')
  }
}

class CsvFileParser implements FileParser {
  private static _instance = new CsvFileParser()

      private constructor() {}

  static get instance(): CsvFileParser{return CsvFileParser._instance}

  async parseFile(file: Buffer): Promise<SingleComment[]> {
    const data = new Array<SingleComment>()
    const records = parse(file, {
      delimiter : ',',
      columns : true,
      skip_empty_lines : true,
      trim : true,
    })

    if (!records) {
      return reject('apiResponse.invalidInputData')
    }

    let recordKeys: string[];
    for (const record of records) {
      recordKeys = Object.keys(record)
      if (!recordKeys.includes('comment')) {
        return reject('apiResponse.missingComment')
      }
      if (!recordKeys.includes('post')) {
        return reject('apiResponse.missingPost')
      }
      data.push({
        comment : record.comment,
        post : record.post,
      })
    }

    return data
  }
}

class XlsxFileParser implements FileParser {
  private static _instance = new XlsxFileParser()

      private constructor() {}

  static get instance(): XlsxFileParser{return XlsxFileParser._instance}

  // WARNING: what you're about to read will melt you brain down,
  // guess xlsx is just bad everywhere!
  async parseFile(file: Buffer): Promise<SingleComment[]> {
    const records = xlsx.parse(file)
    if (!records || !records[0] || !records[0].data ||
        records[0].data.length === 0) {
      return reject('apiResponse.invalidInputData')
    }

    if (!records[0].data[0].includes('comment')) {
      return reject('apiResponse.missingComment')
    }
    if (!records[0].data[0].includes('post')) {
      return reject('apiResponse.missingPost')
    }

    const commentIndex = records[0].data[0].indexOf('comment')
    const postIndex = records[0].data[0].indexOf('post')

    const data = new Array<SingleComment>()
    for (const record of records[0].data.slice(1)) {
      data.push({
        comment : record[commentIndex],
        post : record[postIndex],
      })
    }

    return data
  }
}
