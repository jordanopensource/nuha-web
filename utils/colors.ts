// Unified color tokens for analysis visuals (charts + UI)
// Values are sourced from CSS variables defined in assets/css/main.css

function getCssVar(name: string, fallback: string): string {
  if (import.meta.client && typeof window !== 'undefined') {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
    return v || fallback
  }
  return fallback
}

export const analysisColors = {
  hate: getCssVar('--color-analysis-hate', '#EF5675'),
  hateLight: getCssVar('--color-analysis-hate-100', '#FEE2E2'),
  nonhate: getCssVar('--color-analysis-nonhate', '#4F46E5'),
  nonhateLight: getCssVar('--color-analysis-nonhate-100', '#E0E7FF'),
  neutral: getCssVar('--color-analysis-neutral', '#475569'),
  neutralLight: getCssVar('--color-analysis-neutral-100', '#F1F5F9'),
}

export type AnalysisColorKey = keyof typeof analysisColors
