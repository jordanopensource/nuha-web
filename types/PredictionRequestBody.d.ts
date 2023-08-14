declare global {
  interface PredictionRequestBody {
    type: 'csv' | 'comment'
    data: File | SingleComment
  }
}

export {}
