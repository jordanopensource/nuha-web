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
    @apply mb-4 mt-8 font-Parastoo font-semibold;
  }

  .prose :deep(h4),
  .prose :deep(h5),
  .prose :deep(h6) {
    @apply mb-4 mt-8 font-IBMPlexSansArabic font-semibold;
  }

  .prose :deep(h1:first-child),
  .prose :deep(h2:first-child),
  .prose :deep(h3:first-child),
  .prose :deep(h4:first-child),
  .prose :deep(h5:first-child),
  .prose :deep(h6:first-child) {
    margin-top: 0;
  }

  .prose :deep(h2),
  .prose :deep(h3) {
    @apply text-h2-m lg:text-h2;
  }

  .prose :deep(p) {
    @apply mb-4;
  }

  /* Lists */
  .prose :deep(ul),
  .prose :deep(ol) {
    @apply mb-4 ps-6;
  }

  .prose :deep(ul) {
    @apply list-disc;
  }

  .prose :deep(ol) {
    @apply list-decimal;
  }

  .prose :deep(li) {
    @apply mb-0;
  }

  .prose :deep(em) {
    @apply italic;
  }

  .prose :deep(blockquote) {
    @apply my-4 border-s-4 border-colors-primary ps-4 italic;
  }

  .prose :deep(code) {
    @apply rounded bg-colors-primary-light px-2 py-1 font-IBMPlexMono text-sm;
  }

  .prose :deep(pre) {
    @apply my-4 overflow-x-auto rounded-md bg-colors-primary-light p-4 font-IBMPlexMono;
  }

  .prose :deep(a) {
    @apply text-colors-primary hover:underline;
  }

  .prose :deep(img) {
    @apply my-4 h-auto max-w-full rounded-md;
  }

  /* Tables */
  .prose :deep(table) {
    @apply my-2 w-full border-collapse;
  }

  .prose :deep(th),
  .prose :deep(td) {
    @apply border border-colors-neutral-placeholder border-opacity-20 px-3 py-2 text-start align-top;
  }

  .prose :deep(th) {
    @apply bg-colors-neutral-background font-semibold;
  }

  .prose :deep(caption) {
    @apply mb-2 text-start text-subtext text-colors-neutral-placeholder;
  }
</style>
