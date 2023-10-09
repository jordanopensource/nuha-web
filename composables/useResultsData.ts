import { set } from '@vueuse/core'

export const useResultsData = () => {
  const resultsData = useState('results', () => {
    return {}
  })
  return {
    resultsData: () => {
      return resultsData
    },
    updateResultsData: (_resultsData: any) => {
      set(resultsData, _resultsData)
    },
    resetResutsData: () => {
      set(resultsData, {})
    },
  }
}
