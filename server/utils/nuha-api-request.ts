import { PredictionResponse, SingleComment } from '../../types'

const runtimeConfig = useRuntimeConfig()

export async function predictCommentsResults(
  comments: SingleComment[],
): Promise<PredictionResponse[]> {
  let err: unknown
  const prediciton = await fetch(`${runtimeConfig.api.url}/predict`, {
    mode: 'navigate',
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${runtimeConfig.api.token}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(comments),
  })
    .then((resp) => resp.json())
    .then((predections) => predections)
    .catch((_err) => (err = _err))

  if (!prediciton[0]) {
    return []
  }

  return prediciton
}
