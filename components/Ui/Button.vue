<template>
  <button
    v-if="!to"
    class="button"
    :class="`btn-${size} btn-${variant}`"
    :type="type"
    :disabled="disabled || loading"
  >
    <slot></slot>
    <slot v-if="!loading" name="icon"></slot>
    <slot v-else name="loading">
      <Icon name="mdi:loading" class="loader !h-6 !w-6" />
    </slot>
  </button>
  <NuxtLink
    v-else
    :to="to"
    class="button"
    :class="`btn-${size} btn-${variant}`"
    :disabled="disabled || loading"
  >
    <slot></slot>
    <slot v-if="!loading" name="icon"></slot>
    <slot v-else name="loading">
      <div class="loader !h-6 !w-6"></div>
    </slot>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button',
  },
  variant: {
    type: String as () => 'primary' | 'outline' | 'ghost',
    default: 'primary',
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  // for rendering a button-styled link
  to: {
    type: String,
    required: false,
    default: null
  },
})
</script>

<style lang="postcss" scoped>
.button {
  @apply select-none flex items-center justify-center gap-2 rounded-md font-normal font-IBMPlexSansArabic;
  @apply max-sm:gap-1 disabled:cursor-not-allowed text-start;
  @apply transition duration-200 ease-in-out;
  @apply focus:outline focus:outline-colors-neutral-foreground focus:scale-95;
}
.btn-sm {
  @apply text-sm px-3 py-1.5;
}
.btn-md {
  @apply text-base px-4 py-2;
}
.btn-lg {
  @apply text-lg px-5 py-2.5;
}

.btn-primary {
  @apply bg-colors-primary text-colors-neutral-background;
  @apply hover:bg-colors-primary-hover;
  @apply active:bg-colors-primary-active;
  @apply disabled:bg-colors-primary disabled:opacity-50;
  .loader {
    @apply border-colors-neutral-background;
  }
}

.btn-outline {
  @apply bg-colors-primary-light border border-colors-neutral-foreground text-colors-neutral-foreground;
  @apply hover:bg-colors-primary-light hover:bg-opacity-40;
  @apply active:bg-colors-primary-light;
  @apply  disabled:bg-transparent disabled:bg-opacity-80;
  .loader {
    @apply border-colors-neutral-foreground;
  }
}

.btn-ghost {
  @apply bg-transparent text-colors-neutral-foreground;
  @apply hover:bg-colors-primary-light hover:bg-opacity-40;
  @apply active:bg-colors-primary-light active:shadow-sm;
  @apply disabled:bg-colors-primary-light disabled:bg-opacity-80;
  .loader {
    @apply border-colors-neutral-foreground;
  }
}
</style>