<template>
  <button
    v-if="!to"
    class="button"
    :class="`btn-${size} btn-${variant}`"
    :type="type"
    :disabled="disabled || loading"
  >
    <slot></slot>
    <slot name="icon" v-if="!loading"></slot>
    <slot name="loading" v-else>
      <div class="loader !h-6 !w-6"></div>
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
    <slot name="icon" v-if="!loading"></slot>
    <slot name="loading" v-else>
      <div class="loader !h-6 !w-6"></div>
    </slot>
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps({
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
  },
})
</script>

<style lang="postcss" scoped>
.button {
  @apply select-none flex items-center justify-center gap-2 rounded-md font-normal;
  @apply max-sm:gap-1 disabled:cursor-not-allowed text-start;
  @apply transition duration-200 ease-in-out;
}
.btn-sm {
  @apply text-sm px-3 py-1.5;
}
.btn-md {
  @apply text-base px-4 py-2;
}
.btn-lg {
  @apply text-lg px-5 py-3;
}

.btn-primary {
  @apply bg-nuha-fushia text-white;
  @apply hover:bg-nuha-fushia-hover;
  @apply active:bg-nuha-fushia-700;
  @apply disabled:bg-nuha-fushia disabled:opacity-50;
  .loader {
    @apply border-white;
  }
}

.btn-outline {
  @apply border border-nuha-fushia text-nuha-fushia;
  @apply hover:bg-nuha-fushia-200 hover:bg-opacity-40;
  @apply active:bg-nuha-fushia-200;
  @apply  disabled:bg-transparent disabled:bg-opacity-80;
  .loader {
    @apply border-nuha-fushia;
  }
}

.btn-ghost {
  @apply bg-transparent text-nuha-fushia;
  @apply hover:bg-nuha-fushia-200 hover:bg-opacity-40;
  @apply active:bg-nuha-fushia-200 active:shadow-sm;
  @apply disabled:bg-nuha-fushia-200 disabled:bg-opacity-80;
  .loader {
    @apply border-nuha-fushia;
  }
}
</style>