import { useWindowScroll } from '@vueuse/core'

export default defineNuxtPlugin((nuxtApp) => {
  const { x, y } = useWindowScroll(window)
  return {
    provide: {
      useScroll: () => {
        return { x, y }
      },
    },
  }
})
