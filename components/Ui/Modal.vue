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
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      @click="onBackdropClick"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-colors-neutral-background bg-opacity-20 backdrop-blur-lg" />
      
      <!-- Modal Container -->
      <div
        class="modal-container relative w-full max-w-2xl max-h-[80vh] bg-colors-neutral-background rounded-lg shadow-xl overflow-hidden flex flex-col"
        :class="modalSizeClasses"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-colors-neutral-foreground border-opacity-20">
          <h2 v-if="title" class="text-xl font-medium text-colors-neutral-foreground font-IBMPlexSansArabic">
            {{ title }}
          </h2>
          <div v-else class="flex-1">
            <slot name="title" />
          </div>
          
          <UiButton
            variant="ghost"
            size="sm"
            :aria-label="closeAriaLabel"
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
          class="flex items-center justify-end gap-3 p-6 border-t border-colors-neutral-foreground border-opacity-20"
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
  loading: false
})

interface Emits {
  'update:modelValue': [value: boolean]
  'close': []
  'action': []
  'cancel': []
}

const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const modalSizeClasses = computed(() => {
  const sizeMap = {
    'sm': 'max-w-md',
    'md': 'max-w-2xl',
    'lg': 'max-w-4xl',
    'xl': 'max-w-6xl',
    'full': 'max-w-none w-full h-full lg:max-w-[95vw] lg:max-h-[95vh] lg:h-auto'
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
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Body scroll lock
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

</script>

<style lang="postcss" scoped></style>
