<script setup lang="ts">
  import type { PublicationHeading } from '~/types/publication'

  defineProps<{
    headings: PublicationHeading[]
  }>()

  const isOpen = ref(true)
  const listId = useId()
</script>

<template>
  <nav v-if="headings.length" class="toc font-LTZarid">
    <h4
      class="flex items-center justify-between gap-2 border-b border-b-colors-neutral-placeholder border-opacity-20 pb-1 font-bold"
    >
      {{ $t('publications.single.tableOfContent') }}
      <UiButton
        variant="ghost"
        size="sm"
        class="aspect-square shrink-0 !rounded-full !p-1"
        :title="
          isOpen
            ? $t('publications.single.collapseToC')
            : $t('publications.single.expandToC')
        "
        :aria-expanded="isOpen"
        :aria-controls="listId"
        @click="isOpen = !isOpen"
      >
        <Icon
          name="mdi:chevron-down"
          size="20"
          class="transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </UiButton>
    </h4>
    <div
      :id="listId"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!isOpen"
    >
      <ul class="list-inside list-disc overflow-hidden pt-2">
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
    </div>
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
