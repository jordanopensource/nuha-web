<template>
  <NuxtLink
    :to="$localePath(publicationLink)"
    class="publication-card"
    :class="{ 'featured-card': featured }"
  >
    <div
      class="flex h-full flex-col max-md:!flex"
      :class="{
        'grid-cols-2 items-start md:grid md:gap-4 xl:grid-cols-3': featured,
      }"
    >
      <div v-if="coverImageUrl" class="h-max w-full overflow-hidden">
        <img
          :src="coverImageUrl"
          :alt="title"
          class="max-h-72 w-full object-cover"
          :class="{ 'md:max-h-full md:pe-1': featured }"
          loading="lazy"
        />
      </div>
      <div
        class="my-auto flex flex-col gap-3 px-2 py-4"
        :class="{
          'col-span-full !w-full grid-cols-2 md:grid':
            featured && !coverImageUrl,
          'md:h-full': featured,
        }"
      >
        <h3 class="line-clamp-2 font-LTZarid font-semibold">
          {{ title }}
        </h3>
        <p
          v-if="excerpt"
          class="line-clamp-3 font-LTZarid text-base text-colors-neutral-foreground"
          :class="{ 'line-clamp-6': featured }"
        >
          {{ excerpt }}
        </p>
        <UiChip
          v-if="category"
          :text="category"
          class="category w-max transition-colors duration-200"
          :class="{ 'md:mt-auto': featured }"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
  interface Props {
    title: string
    coverImageUrl?: string | null
    excerpt?: string | null
    category?: string | null
    featured?: boolean
    slug: string
  }

  const props = withDefaults(defineProps<Props>(), {
    featured: false,
    category: null,
    coverImageUrl: null,
    excerpt: null,
  })

  const route = useRoute()
  const { region } = useGeolocation()

  const publicationLink = computed(() => {
    // Build the link using the current route's region parameter
    const pubRegion =
      (route.params.region as string) || region.value?.countryCode
    if (pubRegion) {
      return `/${pubRegion.toLowerCase()}/publications/${props.slug}`
    }
    return `/publications/${props.slug}`
  })
</script>

<style lang="postcss" scoped>
  .publication-card {
    @apply block rounded-md bg-colors-neutral-background;
    @apply border border-colors-neutral-placeholder border-opacity-5;
    @apply transition-shadow duration-200 hover:shadow-md;
    @apply transition-colors duration-200 hover:bg-colors-primary-light hover:bg-opacity-50 hover:text-colors-neutral-foreground;
    @apply overflow-hidden;
  }

  .publication-card:hover {
    @apply border-colors-primary border-opacity-20;
    .category {
      @apply bg-colors-primary bg-opacity-10;
    }
  }

  /* Featured Card Layout */
  .featured-card {
    @apply col-span-full md:max-h-80;
  }
</style>
