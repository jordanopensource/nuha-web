<template>
  <div
    class="rounded-md border p-4 font-IBMPlexSansArabic"
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
      <div class="msg flex-1 whitespace-break-spaces text-sm font-medium">
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
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  type MessageType = 'info' | 'success' | 'warning' | 'error'

  const props = withDefaults(
    defineProps<{
      type?: MessageType
      message?: string
      showIcon?: boolean
      showCloseButton?: boolean
      icon?: string
    }>(),
    {
      type: 'info',
      message: '',
      showIcon: true,
      showCloseButton: false,
      icon: '',
    }
  )

  const iconMap: Record<MessageType, string> = {
    info: 'mdi:information-outline',
    success: 'mdi:check-circle-outline',
    warning: 'mdi:alert-outline',
    error: 'mdi:alert-circle-outline',
  }

  const iconName = computed(() => props.icon || iconMap[props.type])

  defineEmits<{
    close: []
  }>()
</script>

<style lang="postcss" scoped>
  /* Info variant - neutral blue tones */
  .ui-message--info {
    @apply border-blue-200 bg-blue-50 text-blue-800;
  }

  .ui-message--info .ui-message__icon {
    @apply text-blue-600;
  }

  .ui-message--info .ui-message__close-button {
    @apply text-blue-600 hover:bg-blue-100 hover:text-blue-700;
  }

  /* Success variant - green tones */
  .ui-message--success {
    @apply border-green-300 bg-green-100 text-green-900;
    @apply selection:bg-green-200 selection:text-green-900;
  }

  .ui-message--success .ui-message__icon {
    @apply text-green-700;
  }

  .ui-message--success .ui-message__close-button {
    @apply text-green-700 hover:bg-green-200 hover:text-green-900;
  }

  /* Warning variant - amber tones */
  .ui-message--warning {
    @apply border-amber-300 bg-amber-100 text-amber-900;
    @apply selection:bg-amber-200 selection:text-amber-900;
  }

  .ui-message--warning .ui-message__icon {
    @apply text-amber-700;
  }

  .ui-message--warning .ui-message__close-button {
    @apply text-amber-700 hover:bg-amber-200 hover:text-amber-900;
  }

  /* Error variant - red tones */
  .ui-message--error {
    @apply border-red-300 bg-red-100 text-red-900;
    @apply selection:bg-red-200 selection:text-red-900;
  }

  .ui-message--error .ui-message__icon {
    @apply text-red-700;
  }

  .ui-message--error .ui-message__close-button {
    @apply text-red-700 hover:bg-red-200 hover:text-red-900;
  }
</style>
