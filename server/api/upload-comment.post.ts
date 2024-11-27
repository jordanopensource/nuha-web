import { predictCommentsResults } from '../utils/nuha-api-request'
import { reject } from '../utils/promise-handlers'

export default defineEventHandler(async (event) => {
  const data = await readBody<SingleComment>(event)
  const dataKeys = Object.keys(data)
  if (!dataKeys.includes('comment')) {
    setResponseStatus(event, 400)
    return 'apiResponse.missingComment'
  }
  if (!data.comment) {
    setResponseStatus(event, 400)
    return 'apiResponse.missingComment'
  }

  const err = await verifyData(data).catch((err) => err)
  if (err) {
    setResponseStatus(event, 400)
    return err
  }

  const prediction = await predictCommentsResults([data])
  if (!prediction) {
    setResponseStatus(event, 500)
    return 'apiResponse.internalError'
  }
  return { prediction }
})

async function verifyData(input: SingleComment): Promise<void> {
  const onlyNumberPattern = new RegExp(/(\d+(\.)*\d*)/gm)
  if (checkRegExpFullMatch(onlyNumberPattern, input.comment)) {
    return reject('apiResponse.commentOnlyContainingNumbers')
  }

  const emailPattern = new RegExp(
    /(?:[a-zA-Z\d!#$%&'*+/=?^_{|}~-]+(?:\.[a-zA-Z\d!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?\.)+[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-zA-Z\d-]*[a-zA-Z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/gm
  )
  if (input.comment.match(emailPattern)) {
    return reject('apiResponse.commentContainsEmail')
  }

  const urlPattern = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm
  )
  if (input.comment.match(urlPattern)) {
    return reject('apiResponse.commentContainsUrl')
  }
}

function checkRegExpFullMatch(pattern: RegExp, text: string): boolean {
  return text.length === text.match(pattern)?.join(' ').length
}
