export interface FileParser {
  parseFile(file: Buffer): Promise<Record<string, string>>
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

  async parseFile(file: Buffer): Promise<Record<string, string>> {
    return { '': '' }
  }
}

class XlsxFileParser implements FileParser {
  private static _instance = new XlsxFileParser()

  private constructor() {}

  static get instance(): XlsxFileParser {
    return XlsxFileParser._instance
  }

  async parseFile(file: Buffer): Promise<Record<string, string>> {
    return { '': '' }
  }
}
