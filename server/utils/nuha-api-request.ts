import { PredictionResponse, SingleComment } from '../../types'

const runtimeConfig = useRuntimeConfig()

export async function predictCommentsResults(comments: SingleComment[]) {
  let err: unknown
  const prediciton = await fetch(`${runtimeConfig.apiUrl}/predict`, {
    mode: 'cors',
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(comments),
  })
    .then((resp) => resp.json())
    .then((predections) => predections)
    .catch((_err) => {
      err = _err
      return []
    })

  if (!prediciton[0] || err) {
    return undefined
  }

  return getPieChartUsableData(prediciton)
}

function getPieChartUsableData(predictions: PredictionResponse[]) {
  const {
    hateSpeechConfidenceScore,
    hateSpeechCount,
    nonHateSpeechConfidenceScore,
    nonHateSpeechCount,
  } = computeConfidenceScore(predictions)

  const totalCount = hateSpeechCount + nonHateSpeechCount
  const hateSpeechPercentage = (hateSpeechCount / totalCount) * 100
  const nonHateSpeechPercentage = (nonHateSpeechCount / totalCount) * 100

  return {
    hateSpeechPercentage,
    hateSpeechCount,
    hateSpeechConfidenceScore,
    nonHateSpeechPercentage,
    nonHateSpeechConfidenceScore,
    nonHateSpeechCount,
  }
}

function computeConfidenceScore(predictions: PredictionResponse[]) {
  let hateSpeechConfidenceScore = 0
  let nonHateSpeechConfidenceScore = 0

  let hateSpeechCount = 0
  let nonHateSpeechCount = 0
  for (const prediction of predictions) {
    if (prediction.label === 'hate-speech') {
      hateSpeechConfidenceScore += prediction.score
      hateSpeechCount++
    }
    if (prediction.label === 'non-hate-speech') {
      nonHateSpeechConfidenceScore += prediction.score
      nonHateSpeechCount++
    }
  }

  hateSpeechConfidenceScore /= hateSpeechCount
  nonHateSpeechConfidenceScore /= nonHateSpeechCount

  if (!hateSpeechConfidenceScore) {
    hateSpeechConfidenceScore = 0
  }
  if (!nonHateSpeechConfidenceScore) {
    nonHateSpeechConfidenceScore = 0
  }

  return {
    hateSpeechConfidenceScore,
    hateSpeechCount,
    nonHateSpeechConfidenceScore,
    nonHateSpeechCount,
  }
}
