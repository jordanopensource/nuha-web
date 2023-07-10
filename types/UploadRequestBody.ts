import SingleComment from './SingleComment'

export default interface UploadRequestBody {
  type: 'csv' | 'comment'
  data: File | SingleComment
}
