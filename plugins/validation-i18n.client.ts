/**
 * Replaces the browser's native form validation messages with localized ones,
 */

type ValidatableElement =
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const isValidatable = (
  target: EventTarget | null
): target is ValidatableElement =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLSelectElement ||
  target instanceof HTMLTextAreaElement

const valueMissingKey = (el: ValidatableElement) => {
  if (el instanceof HTMLSelectElement) return 'valueMissingSelect'
  if (el instanceof HTMLInputElement) {
    if (el.type === 'checkbox') return 'valueMissingCheckbox'
    if (el.type === 'radio') return 'valueMissingRadio'
    if (el.type === 'file') return 'valueMissingFile'
  }
  return 'valueMissing'
}

const typeMismatchKey = (el: ValidatableElement) => {
  if (el instanceof HTMLInputElement) {
    if (el.type === 'email') return 'typeMismatchEmail'
    if (el.type === 'url') return 'typeMismatchUrl'
  }
  return 'invalid'
}

export default defineNuxtPlugin((nuxtApp) => {
  const t = (key: string, params: Record<string, unknown> = {}) =>
    nuxtApp.$i18n.t(`validation.${key}`, params)

  const getMessage = (el: ValidatableElement): string => {
    // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState#instance_properties
    const { validity } = el

    if (validity.valid) return ''
    if (validity.valueMissing) return t(valueMissingKey(el))
    if (validity.typeMismatch) return t(typeMismatchKey(el))
    if (validity.patternMismatch) return t('patternMismatch')
    if (validity.tooShort && 'minLength' in el) {
      return t('tooShort', { min: el.minLength, current: el.value.length })
    }
    if (validity.tooLong && 'maxLength' in el) {
      return t('tooLong', { max: el.maxLength, current: el.value.length })
    }
    if (validity.rangeUnderflow && 'min' in el) {
      return t('rangeUnderflow', { min: el.min })
    }
    if (validity.rangeOverflow && 'max' in el) {
      return t('rangeOverflow', { max: el.max })
    }

    // anything else
    return t('invalid')
  }

  const onInvalid = (event: Event) => {
    const el = event.target
    if (!isValidatable(el)) return

    // drop the message set on a previous attempt first
    el.setCustomValidity('')
    el.setCustomValidity(getMessage(el))
  }

  const onEdit = (event: Event) => {
    const el = event.target
    if (!isValidatable(el) || !el.validity.customError) return
    el.setCustomValidity('')
  }

  // `invalid` does not bubble, so it is caught on the way down instead.
  document.addEventListener('invalid', onInvalid, true)
  document.addEventListener('input', onEdit, true)
  document.addEventListener('change', onEdit, true)

  nuxtApp.hook('app:unmount', () => {
    document.removeEventListener('invalid', onInvalid, true)
    document.removeEventListener('input', onEdit, true)
    document.removeEventListener('change', onEdit, true)
  })
})
