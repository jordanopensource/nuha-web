<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <div class="text-center">
        <Icon name="mdi:loading" class="loader mb-4 !h-8 !w-8" />
        <p class="text-colors-neutral-foreground">
          {{ $t('misc.loading', 'Loading...') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !publication" class="py-12">
      <UiMessage :message="$t('publications.single.notFound')" type="error">
        <template #actions>
          <UiButton :to="$localePath(publicationsUrl)" size="sm">
            {{ $t('publications.single.backToPublications') }}
          </UiButton>
        </template>
      </UiMessage>
    </div>

    <!-- Publication Content -->
    <article
      v-else-if="publication"
      class="grid w-full grid-cols-4 gap-8 max-md:grid-cols-1"
    >
      <!-- Side bar on large screen -->
      <div class="max-md:hidden">
        <div class="sticky top-0 flex flex-col gap-4 py-2">
          <PublicationCategoriesRow
            :category="publication.category"
            :regions="publication.regions"
            class="mt-1"
          />

          <!-- Side Table of Content -->
          <PublicationToC
            class="rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4"
            :body="processedBody"
          />

          <!-- Authors and Meta Row -->
          <PublicationMetaRow
            class="!flex-col !items-start"
            :authors="publication.authors"
            :updated-at="publication.updatedAt"
            :url="currentUrl"
            :title="publication.title"
          />
        </div>
      </div>

      <div class="col-span-3 col-start-2">
        <PublicationCategoriesRow
          :category="publication.category"
          :regions="publication.regions"
          class="mx-auto mb-4 max-w-lg md:hidden"
        />

        <!-- Title -->
        <h1 class="mx-auto max-w-lg font-LTZarid">
          {{ publication.title }}
        </h1>

        <!-- Abstract -->
        <div
          v-if="publication.abstract"
          class="publication-abstract mx-auto max-w-lg font-LTZarid text-lg leading-relaxed text-colors-neutral-foreground"
        >
          <p>{{ publication.abstract }}</p>
        </div>

        <!-- Cover Image -->
        <div v-if="coverUrl" class="mx-auto my-4 w-full">
          <img
            :src="coverUrl"
            :alt="publication.cover?.alternativeText || publication.title"
            class="mx-auto h-auto max-h-[30rem] w-full max-w-2xl rounded-md object-cover shadow-sm"
          />
        </div>

        <!-- Authors and Meta Row -->
        <div class="mx-auto max-w-lg md:!hidden">
          <PublicationMetaRow
            :authors="publication.authors"
            :updated-at="publication.updatedAt"
            :url="currentUrl"
            :title="publication.title"
          />
        </div>

        <!-- Table of Content -->
        <div class="mx-auto max-w-lg px-2 md:hidden">
          <PublicationToC
            class="rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4"
            :body="processedBody"
          />
        </div>

        <!-- Publication Body -->
        <div
          v-if="publication.body"
          class="publication-body mx-auto max-w-lg text-pretty font-LTZarid text-base leading-relaxed text-colors-neutral-foreground"
          v-html="processedBody"
        />
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
  import type { StrapiLocale } from '@nuxtjs/strapi'
  import type { Publication } from '~/types/strapi'

  const { addHeadingIds } = usePublications()
  const { locale } = useI18n()
  const { find } = useStrapi()
  const route = useRoute()
  const { getPublicationCoverUrl } = usePublications()
  // const { region } = useGeolocation()

  const slug = computed(() => route.params.slug as string)

  // Fetch single publication
  const { data, pending, error } = useAsyncData(
    `publication-${slug.value}`,
    () =>
      find<Publication>('publications', {
        locale: locale.value as StrapiLocale,
        // @ts-expect-error it just works!
        populate: {
          category: true,
          cover: true,
          regions: true,
          authors: true,
        },
        filters: {
          slug: {
            $eq: slug.value,
          },
          // regions: {
          //   // @ts-expect-error it just works!
          //   code: {
          //     $eq: region.value?.countryCode?.toLowerCase()
          //   }
          // }
        },
      }),
    {
      server: false,
      watch: [slug],
    }
  )

  const publication = computed(() => data.value?.data?.[0])
  const processedBody = computed(() => addHeadingIds(publication.value?.body))

  // URL for back to publications
  const publicationsUrl = computed(() => {
    const regionParam = route.params.region as string
    if (regionParam) {
      return `/${regionParam}/publications`
    }
    return '/publications'
  })

  // Current page URL for sharing
  const currentUrl = computed(() => {
    if (import.meta.client) {
      return window.location.href
    }
    return ''
  })

  // Get cover URL using the composable
  const coverUrl = computed(() => {
    return getPublicationCoverUrl(publication.value?.cover?.url)
  })

  // SEO Meta
  useHead(() => ({
    title: publication.value
      ? `${publication.value.title} — ${$t('homepage.nuha')}`
      : `${$t('publications.page.title')} — ${$t('homepage.nuha')}`,
    meta: [
      {
        name: 'description',
        content: publication.value?.abstract || '',
      },
      {
        property: 'og:title',
        content: publication.value?.title || '',
      },
      {
        property: 'og:description',
        content: publication.value?.abstract || '',
      },
      {
        property: 'og:image',
        content: coverUrl.value || '',
      },
    ],
  }))
</script>

<style lang="postcss" scoped>
  .publication-abstract p {
    @apply mb-0;
  }

  /* Publication Body */

  .publication-body :deep(h1),
  .publication-body :deep(h2),
  .publication-body :deep(h3),
  .publication-body :deep(h4),
  .publication-body :deep(h5),
  .publication-body :deep(h6) {
    @apply mb-4 mt-8 font-LTZarid font-semibold;
  }

  .publication-body :deep(h2) {
    @apply text-h3;
  }

  .publication-body :deep(h3) {
    @apply text-h4;
  }

  .publication-body :deep(p) {
    @apply mb-4;
  }

  .publication-body :deep(ul),
  .publication-body :deep(ol) {
    @apply mb-4 pl-6;
  }
  .publication-body :deep(ul) {
    @apply list-disc;
    li {
      @apply mb-0;
    }
  }
  .publication-body :deep(ol) {
    @apply list-decimal;
    li {
      @apply mb-0;
    }
  }

  .publication-body :deep(li) {
    @apply mb-2;
  }

  .publication-body :deep(blockquote) {
    @apply my-4 border-l-4 border-colors-primary pl-4 italic;
  }

  .publication-body :deep(code) {
    @apply rounded bg-colors-primary-light px-2 py-1 font-IBMPlexMono text-sm;
  }

  .publication-body :deep(pre) {
    @apply my-4 overflow-x-auto rounded-md bg-colors-primary-light p-4 font-IBMPlexMono;
  }

  .publication-body :deep(a) {
    @apply text-colors-primary hover:underline;
  }

  .publication-body :deep(img) {
    @apply my-4 h-auto max-w-full rounded-md;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .publication-title {
      @apply text-h1-m;
    }
  }
</style>
