declare global {
  interface PredictionMetrics {
    hateSpeechPercentage: number
    hateSpeechCount: number
    hateSpeechConfidenceScore: number
    nonHateSpeechPercentage: number
    nonHateSpeechConfidenceScore: number
    nonHateSpeechCount: number
  }
}
export {}
