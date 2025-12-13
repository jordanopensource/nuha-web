export interface CommentData {
  comment: string
  platform?: string
  date?: string
}

// single text classification request
export interface ClassifyRequest {
  text: string
}

// batch text classification request
export interface BatchClassifyRequest {
  texts: string[]
}

// single classification response
export interface ClassificationResult {
  is_valid: boolean
  sub_class: string
  main_class: string
  confidence: number
}

// batch classification response
export interface BatchClassifyResponse {
  results: ClassificationResult[]
}

// validation error response
export interface ValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

// health check response
export interface HealthResponse {
  status: string
}

// legacy interface for backward compatibility
export interface AIAnalysisRequest {
  comments: CommentData[]
  // model_dialect: string // NOTE: may be added back later to support multi-dialect API
}
export interface AIAnalysisResponse {
  results: Array<{
    originalComment: string
    platform?: string
    date?: string
    is_valid: boolean
    main_class: string
    sub_class: string
    confidence: number
  }>
}
