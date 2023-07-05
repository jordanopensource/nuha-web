import { get } from '@vueuse/core'

export default function () {
  const { $useScroll } = useNuxtApp()
  if (typeof $useScroll === 'function') {
    const { y } = $useScroll()
    return computed(() => get(y) !== 0)
  }
  return computed(() => false)
}
