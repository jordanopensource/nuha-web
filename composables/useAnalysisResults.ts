import type { AIAnalysisResponse } from '~/types/analyze'

/**
 * Composable for managing analysis results state
 * This replaces the problematic URL query parameter approach with proper state management
 */
export const useAnalysisResults = () => {
  const STORAGE_KEY = 'nuha_analysis_results'
  
  // Store analysis results in global state
  const analysisResults = useState<AIAnalysisResponse | null>('analysisResults', () => null)
  
  /**
   * Store analysis results in state and session storage
   */
  const setAnalysisResults = (data: AIAnalysisResponse) => {
    analysisResults.value = data
    
    // Persist to session storage
    if (import.meta.client) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (error) {
        console.warn('Failed to store analysis results in session storage:', error)
      }
    }
  }
  
  /**
   * Get analysis results from state
   */
  const getAnalysisResults = () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      analysisResults.value = stored ? JSON.parse(stored) : null
      return analysisResults.value
    } catch {
      return null
    }
  }
  
  /**
   * Clear analysis results from state and session storage
   */
  const clearAnalysisResults = () => {
    analysisResults.value = null
    
    // Clear from session storage
    if (import.meta.client) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.warn('Failed to clear analysis results from session storage:', error)
      }
    }
  }
  
  /**
   * Check if analysis results exist
   */
  const hasAnalysisResults = computed(() => {
    return getAnalysisResults() !== null
  })
  
  return {
    analysisResults: readonly(analysisResults),
    setAnalysisResults,
    getAnalysisResults,
    clearAnalysisResults,
    hasAnalysisResults
  }
}
