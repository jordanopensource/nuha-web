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
      <div
        class="w-full shrink-0 overflow-hidden"
        :class="featured ? 'md:h-full' : 'aspect-video'"
      >
        <img
          v-if="coverImageUrl && !imageFailed"
          :src="coverImageUrl"
          :alt="title"
          class="w-full object-cover"
          :class="featured ? 'max-h-72 md:max-h-full md:pe-1' : 'h-full'"
          loading="lazy"
          @error="imageFailed = true"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-colors-primary-light"
          :class="{ 'aspect-video md:aspect-auto md:h-full': featured }"
        >
          <Icon
            name="mdi:file-document-outline"
            class="h-8 w-8 text-colors-primary-active sm:h-10 sm:w-10"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        class="flex flex-col gap-3 px-2 py-4"
        :class="{ 'md:h-full': featured }"
      >
        <div class="flex flex-col gap-1">
          <time
            v-if="formattedDate"
            :datetime="machineDate ?? undefined"
            class="text-subtext text-colors-neutral-placeholder"
          >
            {{ formattedDate }}
          </time>
          <h3 class="line-clamp-2 font-LTZarid font-semibold">
            {{ title }}
          </h3>
        </div>
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
    date?: string | null
    featured?: boolean
    slug: string
  }

  const props = withDefaults(defineProps<Props>(), {
    featured: false,
    category: null,
    coverImageUrl: null,
    excerpt: null,
    date: null,
  })

  const route = useRoute()
  const { locale } = useI18n()
  const { region } = useGeolocation()

  // fall back to the placeholder when the cover url itself is broken
  const imageFailed = ref(false)
  watch(
    () => props.coverImageUrl,
    () => {
      imageFailed.value = false
    }
  )

  const publishedDate = computed(() => {
    if (!props.date) return null

    const parsed = new Date(props.date)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  })

  const formattedDate = computed(() =>
    publishedDate.value
      ? new Intl.DateTimeFormat(locale.value, {
          month: 'short',
          year: 'numeric',
        }).format(publishedDate.value)
      : null
  )

  const machineDate = computed(
    () => publishedDate.value?.toISOString().slice(0, 10) ?? null
  )

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
