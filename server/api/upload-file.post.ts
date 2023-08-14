import { FileParser, getFileParser, getFileType } from '../utils'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    setResponseStatus(event, 400)
    return 'invalid file type.'
  }

  const fileType = getFileType(
    files[0].filename?.substring(files[0].filename?.lastIndexOf('.') + 1) ?? ''
  )
  let err: unknown
  const parser = await getFileParser(fileType).catch((_err) => {
    err = _err
    return {} as FileParser
  })
  if (err) {
    setResponseStatus(event, 400)
    return 'invalid file type.'
  }

  const parsedFileData = await parser.parseFile(files[0].data).catch((_err) => {
    err = _err
    return []
  })
  if (err) {
    setResponseStatus(event, 500)
    return err
  }

  if (parsedFileData.length === 0) {
    setResponseStatus(event, 400)
    return 'The input file must have at least one row of data'
  }

  const prediction = await predictCommentsResults(parsedFileData)
  if (!prediction) {
    setResponseStatus(event, 500)
    return 'Something went wrong'
  }
  return prediction
})
