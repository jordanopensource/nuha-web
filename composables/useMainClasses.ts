// Language-agnostic recognition of the main classes returned by the AI model

import type { MainClassColorKey } from '~/utils/colors'

/** Semantic main-class ids (stable and language-agnostic). */
export type MainClassKey = MainClassColorKey

/**
 * Known localized main-class names across current supported languages & dialects.
 */
export const KNOWN_MAIN_CLASSES: Record<MainClassKey, string[]> = {
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

/**
 * Classes whose comments are withheld behind a trigger warning
 */
export const SENSITIVE_MAIN_CLASSES: MainClassKey[] = [
  'violence',
  'harassment',
  'sexualContent',
]
export const SENSITIVE_CONFIDENCE_THRESHOLD = 0.6

export const normalizeMainClassName = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

/** normalized localized name -> semantic key. */
const NAME_TO_KEY: Record<string, MainClassKey> = Object.entries(
  KNOWN_MAIN_CLASSES
).reduce<Record<string, MainClassKey>>((acc, [key, names]) => {
  for (const name of names)
    acc[normalizeMainClassName(name)] = key as MainClassKey
  return acc
}, {})

/** Resolve the semantic key for a localized name, `null` if unknown. */
export const resolveMainClassKey = (name: string): MainClassKey | null =>
  NAME_TO_KEY[normalizeMainClassName(name ?? '')] ?? null

export const isSensitiveMainClass = (name: string): boolean => {
  const key = resolveMainClassKey(name)
  return !!key && SENSITIVE_MAIN_CLASSES.includes(key)
}

export const isSensitiveResult = (result: {
  main_class: string
  confidence: number
}): boolean =>
  isSensitiveMainClass(result.main_class) &&
  result.confidence >= SENSITIVE_CONFIDENCE_THRESHOLD

export const useMainClasses = () => ({
  normalizeMainClassName,
  resolveMainClassKey,
  isSensitiveMainClass,
  isSensitiveResult,
})
