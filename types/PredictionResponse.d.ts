declare global {
  interface PredictionResponse {
    label: 'hate-speech' | 'non-hate-speech'
    score: number
    model_version: string
    post: string
    comment: string
  }
}
export {}
