import { getFileParser, getFileType, reject, resolve } from '../utils'

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)

  if (files) {
    const fileType = getFileType(
      files[0].filename?.substring(files[0].filename?.lastIndexOf('.')) ?? ''
    )
    let err: unknown
    const parsedFile = await getFileParser(fileType).catch((_err) => {
      err = _err
    })
    if (err) {
      setResponseStatus(event, 400)
      return 'invalid file type'
    }

    return 'ok'
  }

  setResponseStatus(event, 400)
  return 'invalid file type'
})
