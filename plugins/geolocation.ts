export default defineNuxtPlugin(() => {
  const geolocation = useState<object | null>('geolocation', () => null)
  
  return {
    provide: {
      geolocation
    }
  }
})
