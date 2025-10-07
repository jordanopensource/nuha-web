<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="page-container">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <div class="text-center">
        <Icon name="mdi:loading" class="loader !h-8 !w-8 mb-4" />
        <p class="text-colors-neutral-foreground">{{ $t('misc.loading', 'Loading...') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !publication" class="py-12">
      <UiMessage
        :message="$t('publications.single.notFound')"
        type="error"
      >
        <template #actions>
          <UiButton :to="$localePath(publicationsUrl)" size="sm">
            {{ $t('publications.single.backToPublications') }}
          </UiButton>
        </template>
      </UiMessage>
    </div>

    <!-- Publication Content -->
    <article v-else-if="publication" class="w-full grid gap-8 grid-cols-4 max-md:grid-cols-1">
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
            class="border border-colors-neutral-placeholder border-opacity-20 rounded-md p-4"
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

      <div class="col-start-2 col-span-3">
        <PublicationCategoriesRow
          :category="publication.category"
          :regions="publication.regions"
          class="max-w-lg mx-auto mb-4 md:hidden"
        />
  
        <!-- Title -->
        <h1 class="max-w-lg mx-auto font-LTZarid">
          {{ publication.title }}
        </h1>
  
        <!-- Abstract -->
        <div
          v-if="publication.abstract"
          class="publication-abstract font-LTZarid text-lg text-colors-neutral-foreground leading-relaxed max-w-lg mx-auto"
        >
          <p>{{ publication.abstract }}</p>
        </div>

        <!-- Cover Image -->
        <div v-if="coverUrl" class="w-full mx-auto my-4">
          <img 
            :src="coverUrl" 
            :alt="publication.cover?.alternativeText || publication.title"
            class="w-full max-w-2xl mx-auto h-auto max-h-[30rem] rounded-md shadow-sm object-cover"
          >
        </div>
  
        <!-- Authors and Meta Row -->
        <div class="max-w-lg mx-auto md:!hidden">
          <PublicationMetaRow
            :authors="publication.authors"
            :updated-at="publication.updatedAt"
            :url="currentUrl"
            :title="publication.title"
          />
        </div>
  
        <!-- Table of Content -->
        <div class="md:hidden px-2 max-w-lg mx-auto">
          <PublicationToC
            class="border border-colors-neutral-placeholder border-opacity-20 rounded-md p-4"
            :body="processedBody"
          />
        </div>
  
        <!-- Publication Body -->
        <p
          v-if="publication.body"
          class="publication-body font-LTZarid text-base text-pretty text-colors-neutral-foreground leading-relaxed max-w-lg mx-auto"
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
  () => find<Publication>('publications', {
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
        $eq: slug.value
      },
      // regions: {
      //   // @ts-expect-error it just works!
      //   code: {
      //     $eq: region.value?.countryCode?.toLowerCase()
      //   }
      // }
    }
  }),
  {
    server: false,
    watch: [slug]
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
  title: publication.value ? `${publication.value.title} — ${$t('homepage.nuha')}`
  : `${$t('publications.page.title')} — ${$t('homepage.nuha')}`,
  meta: [
    {
      name: 'description',
      content: publication.value?.abstract || ''
    },
    {
      property: 'og:title',
      content: publication.value?.title || ''
    },
    {
      property: 'og:description',
      content: publication.value?.abstract || ''
    },
    {
      property: 'og:image',
      content: coverUrl.value || ''
    }
  ]
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
  @apply font-LTZarid font-semibold mt-8 mb-4;
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
    @apply mb-0
  }
}
.publication-body :deep(ol) {
  @apply list-decimal;
  li {
    @apply mb-0
  }
}

.publication-body :deep(li) {
  @apply mb-2;
}

.publication-body :deep(blockquote) {
  @apply border-l-4 border-colors-primary pl-4 italic my-4;
}

.publication-body :deep(code) {
  @apply font-IBMPlexMono bg-colors-primary-light px-2 py-1 rounded text-sm;
}

.publication-body :deep(pre) {
  @apply font-IBMPlexMono bg-colors-primary-light p-4 rounded-md overflow-x-auto my-4;
}

.publication-body :deep(a) {
  @apply text-colors-primary hover:underline;
}

.publication-body :deep(img) {
  @apply max-w-full h-auto rounded-md my-4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .publication-title {
    @apply text-h1-m;
  }
}
</style>
