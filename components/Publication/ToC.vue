<script setup lang="ts">
  import type { PublicationHeading } from '~/types/publication'

  defineProps<{
    headings: PublicationHeading[]
  }>()
</script>

<template>
  <nav v-if="headings.length" class="toc font-LTZarid">
    <h4
      class="mb-2 border-b border-b-colors-neutral-placeholder border-opacity-20 pb-1 font-bold"
    >
      {{ $t('publications.single.tableOfContent') }}
    </h4>
    <ul class="list-inside list-disc">
      <li
        v-for="item in headings"
        :key="item.id"
        :class="`toc-level-${item.level}`"
      >
        <NuxtLink class="hover:underline" :href="`#${item.id}`">{{
          item.text
        }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
  .toc-level-1 {
    @apply ms-0;
  }

  .toc-level-2 {
    @apply ms-2;
  }

  .toc-level-3 {
    @apply ms-4;
  }

  .toc-level-4 {
    @apply ms-6;
  }
</style>
