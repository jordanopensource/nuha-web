export interface CommentData {
  comment: string
  platform?: string
  date?: string
}

export interface AIAnalysisRequest {
  comments: CommentData[]
  model_dialect: string
}

export interface AIAnalysisResponse {
  general_analysis: {
    hate_speech_percentage: number
    hate_speech_count: number
    hate_speech_confidence_score: number
    non_hate_speech_percentage: number
    non_hate_speech_count: number
    non_hate_speech_confidence_score: number
    model_version: string
    model_dialect: string
  }
  comments_details: Array<{
    originalComment: string
    platform?: string
    date?: string
    label: 'hate-speech' | 'non-hate-speech' | 'neutral'
    score: number
  }>
}
