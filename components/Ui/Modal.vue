<template>
  <Transition
    enter-active-class="duration-100 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      ref="dialogElement"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      @click="onBackdropClick"
    >
      <!-- focusable element used to trap focus inside the modal -->
      <button
        ref="firstFocusTrap"
        tabindex="0"
        class="absolute opacity-0"
        @focus="onFirstFocusTrapFocus"
      />

      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-colors-neutral-background bg-opacity-20 backdrop-blur-lg"
      />

      <!-- Modal Container -->
      <div
        class="modal-container relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-colors-neutral-placeholder border-opacity-40 bg-white shadow-xl"
        :class="modalSizeClasses"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-colors-neutral-foreground border-opacity-20 p-6"
        >
          <h2
            v-if="title"
            class="font-IBMPlexSansArabic text-xl font-medium text-colors-neutral-foreground"
          >
            {{ title }}
          </h2>
          <div v-else class="flex-1">
            <slot name="title" />
          </div>

          <UiButton
            variant="ghost"
            size="sm"
            :aria-label="closeAriaLabel"
            :title="closeAriaLabel"
            class="aspect-square !p-2"
            @click="close"
          >
            <template #icon>
              <Icon :name="closeIcon" size="24" />
            </template>
          </UiButton>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <slot />
        </div>

        <!-- Footer Actions -->
        <div
          v-if="showFooter"
          class="flex items-center justify-end gap-3 border-t border-colors-neutral-foreground border-opacity-20 p-6"
        >
          <slot name="actions">
            <UiButton
              v-if="showCancelButton"
              variant="ghost"
              :disabled="loading"
              @click="cancel"
            >
              {{ cancelButtonText }}
            </UiButton>

            <UiButton
              v-if="showActionButton"
              :variant="actionButtonVariant"
              :loading="loading"
              :disabled="actionButtonDisabled"
              @click="action"
            >
              {{ actionButtonText }}
            </UiButton>
          </slot>
        </div>
      </div>

      <!-- focusable element used to trap focus inside the modal -->
      <button
        ref="lastFocusTrap"
        tabindex="0"
        class="absolute opacity-0"
        @focus="onLastFocusTrapFocus"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  interface Props {
    /**
     * Modal state
     */
    modelValue?: boolean

    title: string

    /**
     * Close button icon from https://icones.netlify.app/collection/mdi
     */
    closeIcon?: string
    closeAriaLabel?: string
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean

    // Action button
    showActionButton?: boolean
    actionButtonText?: string
    actionButtonVariant?: 'primary' | 'outline' | 'ghost'
    actionButtonDisabled?: boolean

    // Cancel button
    showCancelButton?: boolean
    cancelButtonText?: string
    cancelButtonVariant?: 'primary' | 'outline' | 'ghost'

    /**
     * Modal action footer
     */
    showFooter?: boolean

    /**
     * Modal size
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

    /**
     * Modal loading state
     */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    closeIcon: 'mdi:close',
    closeAriaLabel: 'Close modal',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showActionButton: true,
    actionButtonText: 'Save',
    actionButtonVariant: 'primary',
    cancelButtonVariant: 'ghost',
    actionButtonDisabled: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    showFooter: true,
    size: 'md',
    loading: false,
  })

  interface Emits {
    'update:modelValue': [value: boolean]
    close: []
    action: []
    cancel: []
  }

  const emit = defineEmits<Emits>()

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const modalSizeClasses = computed(() => {
    const sizeMap = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-none w-full h-full lg:max-w-[95vw] lg:max-h-[95vh] lg:h-auto',
    }
    return sizeMap[props.size]
  })

  const close = () => {
    isOpen.value = false
    emit('close')
  }

  const action = () => {
    emit('action')
  }

  const cancel = () => {
    isOpen.value = false
    emit('cancel')
  }

  const onBackdropClick = () => {
    if (props.closeOnBackdrop) {
      close()
    }
  }

  // Keyboard handling
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.closeOnEscape && isOpen.value) {
      close()
    }
  }

  const dialogElement = ref<HTMLDialogElement | null>(null)
  const firstFocusTrap = ref<HTMLDivElement | null>(null)
  const lastFocusTrap = ref<HTMLDivElement | null>(null)

  // Focus management functions
  const getFocusableElements = (element: HTMLElement | null): HTMLElement[] => {
    if (!element) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    // Get all focusable elements excluding the trap elements
    const allFocusable = Array.from(
      element.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]
    return allFocusable.filter(
      (el) => el !== firstFocusTrap.value && el !== lastFocusTrap.value
    )
  }

  const focusFirstDescendant = (element: HTMLElement | null) => {
    const focusableElements = getFocusableElements(element)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }
  const focusLastDescendant = (element: HTMLElement | null) => {
    const focusableElements = getFocusableElements(element)
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
    }
  }

  // Focus trap handlers
  // When first trap receives focus (shift+tab from first element), focus last element (and vice-versa)
  const onFirstFocusTrapFocus = () => {
    focusLastDescendant(dialogElement.value)
  }
  const onLastFocusTrapFocus = () => {
    focusFirstDescendant(dialogElement.value)
  }

  // Auto-focus first element when modal opens
  watch(isOpen, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      // Focus first focusable element when modal opens
      nextTick(() => {
        focusFirstDescendant(dialogElement.value)
      })
    } else {
      document.body.style.overflow = ''
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  })
</script>

<style lang="postcss" scoped></style>
