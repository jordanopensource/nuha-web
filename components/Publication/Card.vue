<template>
  <NuxtLink
    :to="publicationLink"
    class="publication-card"
    :class="{ 'featured-card': featured }"
  >
    <div
      class="flex flex-col max-md:!flex"
      :class="{ 'md:grid grid-cols-2 xl:grid-cols-3 md:gap-4 items-start': featured }"
    >
      <div
        v-if="coverUrl"
        class="w-full overflow-hidden h-max"
      >
        <img
          :src="coverUrl"
          :alt="title"
          class="w-full max-h-72 object-cover"
          :class="{ 'md:max-h-full md:pe-1': featured }"
        >
      </div>
      <div
        class="py-4 px-2 flex flex-col gap-3"
        :class="{
          'md:grid grid-cols-2 !w-full col-span-full': featured && !coverUrl,
          'md:h-full': featured
        }"
      >
        <h3 class="font-LTZarid font-semibold line-clamp-2">
          {{ title }}
        </h3>
        <p
          v-if="excerpt"
          class="font-LTZarid text-base text-colors-neutral-foreground line-clamp-3"
          :class="{ 'line-clamp-6': featured }"
        >
          {{ excerpt }}
        </p>
        <span
          v-if="category"
          class="category transition-colors duration-200 w-max inline-block px-3 py-1 bg-colors-primary-light text-colors-neutral-foreground rounded-xl text-sm font-IBMPlexSansArabic self-start"
          :class="{ 'md:mt-auto': featured }"
        >
          {{ category }}
        </span>
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

const publicationLink = computed(() => {
  // Build the link using the current route's region parameter
  const region = route.params.region as string
  if (region) {
    return `/${region}/publications/${props.slug}`
  }
  return `/publications/${props.slug}`
})

const coverUrl = computed(() => {
  console.info("Cover image: ", props.coverImageUrl)
  // FIXME: for some reason when there's no image it returns https://localhost:1337undefined
  // FIXME: check the media provider, if it's "local" then append api url
  if (!props.coverImageUrl || props.coverImageUrl.includes("undefined")) {
    return null
  }
  if (props.coverImageUrl.startsWith('http')) {
    return props.coverImageUrl
  }
  // Ensure only one slash between domain and path
  return `http://localhost:1337${props.coverImageUrl.startsWith('/') ? '' : '/'}${props.coverImageUrl}`
})

</script>

<style lang="postcss" scoped>
.publication-card {
  @apply block bg-colors-neutral-background rounded-md;
  @apply border border-colors-neutral-placeholder border-opacity-5;
  @apply hover:shadow-md transition-shadow duration-200;
  @apply hover:bg-colors-primary-light hover:text-colors-neutral-foreground transition-colors duration-200 hover:bg-opacity-50;
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
