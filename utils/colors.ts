// Unified color tokens for main-class visuals (charts + UI chips).
// The color VALUES live in assets/css/main.css (single source of truth);
// this util maps them to JS so Chart.js and inline styles can consume them.
// Only SSR fallbacks and unknown-class fallback palette are hardcoded here.

function getCssVar(name: string, fallback: string): string {
  if (import.meta.client && typeof window !== 'undefined') {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
    return v || fallback
  }
  return fallback
}

/**
 * Color set for a single main class.
 * - `base` is the solid color used by charts (chart.js can't consume Tailwind classes).
 * - `bg`/`fg` are the chip background & foreground colors used by UI chips.
 */
export interface MainClassColor {
  base: string
  bg: string
  fg: string
}

export type MainClassColorKey =
  | 'violence'
  | 'harassment'
  | 'discrimination'
  | 'insult'
  | 'disagreement'
  | 'sexualContent'
  | 'neutral'

/** Build a color set from the `--color-analysis-<slug>[-bg|-fg]` CSS variables. */
function mainClassColor(
  slug: string,
  fallback: MainClassColor
): MainClassColor {
  return {
    base: getCssVar(`--color-analysis-${slug}`, fallback.base),
    bg: getCssVar(`--color-analysis-${slug}-bg`, fallback.bg),
    fg: getCssVar(`--color-analysis-${slug}-fg`, fallback.fg),
  }
}

/**
 * Semantic color for each main class, sourced from CSS variables defined in
 * assets/css/main.css. Fallback hexes mirror those variables for SSR only.
 */
export const mainClassColors: Record<MainClassColorKey, MainClassColor> = {
  violence: mainClassColor('violence', {
    base: '#f43f5e',
    bg: '#ffe4e6',
    fg: '#9f1239',
  }),
  harassment: mainClassColor('harassment', {
    base: '#f97316',
    bg: '#ffedd5',
    fg: '#c2410c',
  }),
  discrimination: mainClassColor('discrimination', {
    base: '#f59e0b',
    bg: '#fef3c7',
    fg: '#b45309',
  }),
  insult: mainClassColor('insult', {
    base: '#8b5cf6',
    bg: '#ede9fe',
    fg: '#6d28d9',
  }),
  disagreement: mainClassColor('disagreement', {
    base: '#3b82f6',
    bg: '#dbeafe',
    fg: '#1d4ed8',
  }),
  sexualContent: mainClassColor('sexual-content', {
    base: '#d946ef',
    bg: '#fae8ff',
    fg: '#a21caf',
  }),
  neutral: mainClassColor('neutral', {
    base: '#64748b',
    bg: '#f1f5f9',
    fg: '#1e293b',
  }),
}

/**
 * Palette for unknown classes. assigned deterministically in first-seen order.
 */
export const fallbackMainClassColors: MainClassColor[] = [
  { base: '#4f46e5', bg: '#e0e7ff', fg: '#4338ca' },
  { base: '#10b981', bg: '#d1fae5', fg: '#047857' },
  { base: '#0ea5e9', bg: '#e0f2fe', fg: '#0369a1' },
  { base: '#ec4899', bg: '#fce7f3', fg: '#be185d' },
  { base: '#a855f7', bg: '#f3e8ff', fg: '#7e22ce' },
]
