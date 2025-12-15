<template>
  <button
    v-if="!to"
    class="button"
    :class="`btn-${size} btn-${variant}`"
    :type="type"
    :disabled="disabled || loading"
  >
    <slot />
    <slot v-if="!loading" name="icon" />
    <slot v-else name="loading">
      <!-- default loading animation -->
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
    <slot />
    <slot v-if="!loading" name="icon" />
    <slot v-else name="loading">
      <div class="loader !h-6 !w-6" />
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
      default: null,
    },
  })
</script>

<style lang="postcss" scoped>
  .button {
    @apply flex select-none items-center justify-center gap-2 rounded-md font-IBMPlexSansArabic font-normal;
    @apply text-start disabled:cursor-not-allowed max-sm:gap-1;
    @apply transition duration-200 ease-in-out;
    &:focus-visible {
      @apply outline-colors-neutral-foreground;
      outline-width: 2px;
      outline-style: solid;
      isolation: isolate;
    }
    &:not(:disabled):active {
      @apply scale-95;
    }
  }
  .btn-sm {
    @apply px-3 py-1.5 text-sm;
  }
  .btn-md {
    @apply px-4 py-2 text-base;
  }
  /* FIXME: text-lg and text-base have the same size */
  .btn-lg {
    @apply px-5 py-2.5 text-lg;
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
    @apply border border-colors-neutral-foreground bg-colors-primary-light text-colors-neutral-foreground;
    @apply hover:bg-colors-neutral-foreground hover:bg-opacity-80;
    @apply active:bg-colors-neutral-foreground;
    @apply disabled:bg-transparent disabled:bg-opacity-80;
    &:not(:disabled):hover,
    &:not(:disabled):active {
      @apply text-colors-primary-light;
    }
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
