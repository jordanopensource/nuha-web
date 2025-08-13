<template>
  <div
    class="rounded-md p-4 border font-IBMPlexSansArabic"
    :class="`ui-message--${type}`"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="flex items-center gap-4">
      <Icon
        v-if="showIcon"
        :name="iconName"
        class="ui-message__icon"
        size="20"
      />
      <div class="text-sm font-medium flex-1">
        <slot>
          <template v-if="message">{{ message }}</template>
        </slot>
      </div>
      <UiButton
        v-if="showCloseButton"
        variant="ghost"
        size="sm"
        :title="$t('misc.close')"
        :aria-label="$t('misc.close')"
        class="ui-message__close-button"
        @click="$emit('close')"
      >
        <template #icon>
          <Icon name="mdi:close" size="16" />
        </template>
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
type MessageType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(defineProps<{
  type?: MessageType
  message?: string
  showIcon?: boolean
  showCloseButton?: boolean
}>(), {
  type: 'info',
  message: '',
  showIcon: true,
  showCloseButton: false
})

const iconMap: Record<MessageType, string> = {
  info: 'mdi:information-outline',
  success: 'mdi:check-circle-outline', 
  warning: 'mdi:alert-outline',
  error: 'mdi:alert-circle-outline'
}

const iconName = computed(() => iconMap[props.type])

defineEmits<{
  close: []
}>()
</script>

<style lang="postcss" scoped>
/* Info variant - neutral blue tones */
.ui-message--info {
  @apply bg-blue-50 border-blue-200 text-blue-800;
}

.ui-message--info .ui-message__icon {
  @apply text-blue-600;
}

.ui-message--info .ui-message__close-button {
  @apply text-blue-600 hover:bg-blue-100 hover:text-blue-700;
}

/* Success variant - green tones */
.ui-message--success {
  @apply bg-green-50 border-green-200 text-green-800;
}

.ui-message--success .ui-message__icon {
  @apply text-green-600;
}

.ui-message--success .ui-message__close-button {
  @apply text-green-600 hover:bg-green-100 hover:text-green-700;
}

/* Warning variant - amber tones */
.ui-message--warning {
  @apply bg-amber-50 border-amber-200 text-amber-800;
}

.ui-message--warning .ui-message__icon {
  @apply text-amber-600;
}

.ui-message--warning .ui-message__close-button {
  @apply text-amber-600 hover:bg-amber-100 hover:text-amber-700;
}

/* Error variant - red tones */
.ui-message--error {
  @apply bg-red-50 border-red-200 text-red-800;
}

.ui-message--error .ui-message__icon {
  @apply text-red-600;
}

.ui-message--error .ui-message__close-button {
  @apply text-red-600 hover:bg-red-100 hover:text-red-700;
}
</style>
