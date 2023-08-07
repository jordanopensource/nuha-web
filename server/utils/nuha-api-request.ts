import { PredictionResponse, SingleComment } from '../../types'

const runtimeConfig = useRuntimeConfig()

export async function predictCommentsResults(comments: SingleComment[]) {
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
    chartData: [
      { key: 'Hate Speech', value: hateSpeechPercentage },
      { key: 'Non Hate Speech', value: nonHateSpeechPercentage },
    ],
    confidenceScore:
      (hateSpeechConfidenceScore + nonHateSpeechConfidenceScore) /
      (hateSpeechConfidenceScore === 0 || nonHateSpeechConfidenceScore === 0
        ? 1.0
        : 2.0),
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
