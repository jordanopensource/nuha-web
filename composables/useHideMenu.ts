import { get } from '@vueuse/core'

export default function () {
  const { $useScroll } = useNuxtApp()
  if (typeof $useScroll === 'function') {
    const { y } = $useScroll()
    return computed(() => get(y) !== 0 && window.outerWidth > 1024)
  }
  return computed(() => false)
}
