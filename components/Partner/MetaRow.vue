<template>
  <div
    v-if="flagIcon || hasRegions"
    class="flex flex-wrap items-center justify-start gap-2"
  >
    <UiChip
      v-for="region in regions"
      :key="region.code"
      :text="region.name"
      variant="outline"
    />
  </div>
</template>

<script setup lang="ts">
  import type { PublicationRegion as Region } from '~/types/strapi'

  const props = defineProps<{
    /** ISO 3166-1 alpha-2, uppercase */
    country?: string | null
    regions?: Region[]
  }>()

  const hasRegions = computed(() => (props.regions?.length ?? 0) > 0)

  /** the `circle-flags` collection is keyed by the lowercased alpha-2 code */
  const flagIcon = computed(() =>
    props.country && /^[A-Za-z]{2}$/.test(props.country)
      ? `circle-flags:${props.country.toLowerCase()}`
      : null
  )
</script>
