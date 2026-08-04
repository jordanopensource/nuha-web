import type { MainClassColor } from '~/utils/colors'
import { mainClassColors, fallbackMainClassColors } from '~/utils/colors'
import {
  normalizeMainClassName,
  resolveMainClassKey,
} from '~/composables/useMainClasses'

export const useMainClassColors = () => {
  /** Cache used for unknown main classes' colors. */
  const assignments = new Map<string, MainClassColor>()
  let fallbackIndex = 0

  /** Get the full color set for a main class by its name. */
  const getMainClassColor = (name: string): MainClassColor => {
    const semanticKey = resolveMainClassKey(name)
    if (semanticKey) return mainClassColors[semanticKey]

    const cacheKey = normalizeMainClassName(name ?? '')
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
