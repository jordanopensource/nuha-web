<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="prose max-w-measure">
    <div class="font-IBMPlexSansArabic text-base" v-html="html" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    html: string
  }>()
</script>

<style lang="postcss" scoped>
  .prose :deep(h1),
  .prose :deep(h2),
  .prose :deep(h3) {
    @apply mb-4 mt-8 font-LTZarid font-semibold;
  }

  .prose :deep(h4),
  .prose :deep(h5),
  .prose :deep(h6) {
    @apply mb-4 mt-8 font-IBMPlexSansArabic font-semibold;
  }

  .prose :deep(h2),
  .prose :deep(h3) {
    @apply text-h2-m lg:text-h2;
  }

  .prose :deep(h1:first-child),
  .prose :deep(h2:first-child),
  .prose :deep(h3:first-child),
  .prose :deep(h4:first-child),
  .prose :deep(h5:first-child),
  .prose :deep(h6:first-child) {
    margin-top: 0;
  }

  .prose :deep(p) {
    @apply mb-4;
  }

  .prose :deep(ul),
  .prose :deep(ol) {
    @apply mb-4 ms-6;
  }

  .prose :deep(li) {
    @apply mb-2;
  }

  .prose :deep(em) {
    @apply italic;
  }

  .prose :deep(blockquote) {
    @apply ms-4 border-s-4 border-colors-primary border-opacity-30 ps-4 italic text-colors-neutral-foreground;
  }

  .prose :deep(img) {
    @apply my-6 rounded-lg shadow-md;
  }
</style>
