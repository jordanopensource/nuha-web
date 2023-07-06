import { SingleComment } from '../../types'

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody<SingleComment>(event)
  setResponseStatus(event, 400, "ay, i'm not ready yet!")
  return {}
})
