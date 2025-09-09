<template>
  <span
    class="chip"
    :class="`chip-${variant}`"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
}>(), {
  variant: 'primary',
})
</script>

<style lang="postcss" scoped>
.chip {
  @apply inline-block px-3 py-1 rounded-xl;
  @apply text-sm font-IBMPlexSansArabic text-colors-neutral-foreground;
}
.chip-primary {
  @apply bg-colors-primary-light ;
}
.chip-secondary {
  @apply bg-colors-neutral-placeholder bg-opacity-10;
}
.chip-outline {
  @apply bg-colors-neutral-background;
  @apply border border-colors-neutral-placeholder border-opacity-20;
}
</style>
