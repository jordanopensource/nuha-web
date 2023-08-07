export default interface PredictionResponse {
  label: 'hate-speech' | 'non-hate-speech'
  score: number
  model_version: string
}
