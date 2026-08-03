import type { MainClassColor, MainClassColorKey } from '~/utils/colors'
import { mainClassColors, fallbackMainClassColors } from '~/utils/colors'

/** Semantic main-class ids (stable and language-agnostic). */
export type MainClassKey = MainClassColorKey

/**
 * Known localized main-class names across current supported languages & dialects.
 */
const KNOWN_MAIN_CLASSES: Record<MainClassKey, string[]> = {
  violence: ['Violence', 'عنف', 'العنف', 'توندوتیژی'],
  harassment: ['Harassment', 'التحرش', 'هەراسانکردن'],
  discrimination: [
    'Discrimination',
    'تمييز',
    'جیاکاری/هەڵاواردن',
    'Discriminating & Humiliating Language',
    'لغة تمييزية او مهينة',
  ],
  insult: ['Insult', 'إهانة', 'سوکایەتی کردن'],
  disagreement: [
    'Disagreement/Rejection',
    'الاختلاف/الرفض',
    'جیاوازی/ڕەتکردنەوە',
    'Disagreement/Disapproval',
    'اعتراض/رفض',
  ],
  sexualContent: ['Sexual Content', 'المحتوى الجنسي'],
  neutral: ['Neutral', 'محايد', 'بێلایەن'],
}

const normalize = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

/** normalized localized name -> semantic key. */
const NAME_TO_KEY: Record<string, MainClassKey> = Object.entries(
  KNOWN_MAIN_CLASSES
).reduce<Record<string, MainClassKey>>((acc, [key, names]) => {
  for (const name of names) acc[normalize(name)] = key as MainClassKey
  return acc
}, {})

export const useMainClassColors = () => {
  /** Cache used for unknown main classes' colors. */
  const assignments = new Map<string, MainClassColor>()
  let fallbackIndex = 0

  /** Resolve the semantic key for a localized name, `null` if unknown. */
  const resolveMainClassKey = (name: string): MainClassKey | null =>
    NAME_TO_KEY[normalize(name ?? '')] ?? null

  /** Get the full color set for a main class by its name. */
  const getMainClassColor = (name: string): MainClassColor => {
    const semanticKey = resolveMainClassKey(name)
    if (semanticKey) return mainClassColors[semanticKey]

    const cacheKey = normalize(name ?? '')
    const cached = assignments.get(cacheKey)
    if (cached) return cached

    const color = fallbackMainClassColors[
      fallbackIndex % fallbackMainClassColors.length
    ] as MainClassColor
    fallbackIndex++
    assignments.set(cacheKey, color)
    return color
  }

  /** Inline style for a main-class chip (background + foreground colors). */
  const getMainClassChipStyle = (name: string) => {
    const { bg, fg } = getMainClassColor(name)
    return { backgroundColor: bg, color: fg }
  }

  return {
    resolveMainClassKey,
    getMainClassColor,
    getMainClassChipStyle,
  }
}
