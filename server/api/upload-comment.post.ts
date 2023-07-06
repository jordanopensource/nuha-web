import { SingleComment } from '../../types'

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const data = await readBody<SingleComment>(event)
  const dataKeys = Object.keys(data)
  if (!dataKeys.includes('comment')) {
    return reject('invalid data: missing key `comment`.')
  }
  if (!dataKeys.includes('post')) {
    return reject('invalid data: missing key `post`.')
  }

  // TODO: add the actual data processing part.
  console.log(data)
  return {}
})
