export default interface UploadRequestBody {
  type: 'csv' | 'comment'
  data: File | { comment: string; context: string }
}
