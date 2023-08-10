import { SingleComment } from '../../types'
import { predictCommentsResults } from '../utils'

export default defineEventHandler(async (event) => {
  const data = await readBody<SingleComment>(event)
  const dataKeys = Object.keys(data)
  if (!dataKeys.includes('comment')) {
    setResponseStatus(event, 400)
    return 'invalid data: missing key `comment`.'
  }
  if (!data.comment) {
    setResponseStatus(event, 400)
    return 'invalid data: missing data `comment`.'
  }
  if (!dataKeys.includes('post')) {
    setResponseStatus(event, 400)
    return 'invalid data: missing key `post`.'
  }
  if (!data.post) {
    setResponseStatus(event, 400)
    return 'invalid data: missing data `post`.'
  }

  const err = await verifyData(data).catch((err) => err)
  if (err) {
    setResponseStatus(event, 400)
    return err
  }

  const prediction = await predictCommentsResults([data])
  if (!prediction) {
    setResponseStatus(event, 500)
    return 'Something went wrong'
  }
  return prediction
})

async function verifyData(input: SingleComment): Promise<void> {
  const onlyNumberPattern = new RegExp(/(\d+(\.)*\d*)/gm)
  if (checkRegExpFullMatch(onlyNumberPattern, input.post)) {
    return reject('invalid data: post is only containing numbers')
  }
  if (checkRegExpFullMatch(onlyNumberPattern, input.comment)) {
    return reject('invalid data: comment is only containing numbers')
  }

  const emailPattern = new RegExp(
    /(?:[a-zA-Z\d!#$%&'*+/=?^_{|}~-]+(?:\.[a-zA-Z\d!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?\.)+[a-zA-Z\d](?:[a-zA-Z\d-]*[a-zA-Z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-zA-Z\d-]*[a-zA-Z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/gm,
  )
  if (input.post.match(emailPattern)) {
    return reject('invalid data: post contains an email address')
  }
  if (input.comment.match(emailPattern)) {
    return reject('invalid data: comment contains an email address')
  }

  const urlPattern = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm,
  )
  if (input.post.match(urlPattern)) {
    return reject('invalid data: post contains a url')
  }
  if (input.comment.match(urlPattern)) {
    return reject('invalid data: comment contains a url')
  }
}

function checkRegExpFullMatch(pattern: RegExp, text: string): boolean {
  return text.length === text.match(pattern)?.join(' ').length
}
