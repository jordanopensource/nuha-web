<script setup lang="ts">
  const props = defineProps<{
    body: string | undefined
  }>()

  const toc = ref<{ id: string; text: string; level: number }[]>([])

  watchEffect(() => {
    if (!props.body) {
      toc.value = []
      return
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(props.body, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4')

    toc.value = Array.from(headings).map((el) => {
      return {
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.substring(1)), // e.g. "h2" -> 2
      }
    })
  })
</script>

<template>
  <nav v-if="toc.length" class="toc font-LTZarid">
    <h4
      class="mb-2 border-b border-b-colors-neutral-placeholder border-opacity-20 pb-1 font-bold"
    >
      {{ $t('publications.single.tableOfContent') }}
    </h4>
    <ul class="list-inside list-disc">
      <li v-for="item in toc" :key="item.id" :class="`toc-level-${item.level}`">
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
