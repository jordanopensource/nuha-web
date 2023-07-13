import { get } from '@vueuse/core'

export default function (): boolean {
  const { status, data } = useAuth()
  if (!get(data) || !get(status)) {
    return false
  }
  return get(status) === 'authenticated'
}
