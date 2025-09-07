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
    <article v-else-if="publication" class="w-full space-y-6">
      <!-- Category and Region Row -->
      <div class="flex justify-start max-w-lg mx-auto">
        <div class="flex gap-2 flex-wrap">
          <span v-if="publication.category" class="chip">
            {{ publication.category.name }}
          </span>
          <template
            v-if="publication.regions && publication.regions.length > 0"
          >
          <!-- TODO: improve styling of the region chip -->
            <span
              v-for="r in publication.regions"
              :key="r.code"
              class="chip !bg-colors-neutral-placeholder !bg-opacity-20"
            >
              {{ r.name }}
            </span>
          </template>
        </div>
      </div>

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
      <div v-if="coverUrl" class="w-full mx-auto">
        <img 
          :src="coverUrl" 
          :alt="publication.cover?.alternativeText || publication.title"
          class="w-full max-w-2xl mx-auto h-auto max-h-[30rem] rounded-md shadow-sm object-cover"
        >
      </div>

      <!-- Authors and Meta Row -->
      <div class="authors-meta-row max-w-lg mx-auto">
        <div class="flex-1">
          <small
            v-if="publication.authors && publication.authors.length > 0"
            class="font-IBMPlexSansArabic text-colors-neutral-foreground"
          >
            {{ $t('publications.single.authors') }} 
            {{ publication.authors.map(author => author.name).join(', ') }}
          </small>
        </div>
        
        <div class="flex gap-2 items-center">
          <!-- TODO: 18n -->
          <small title="Last Updated">
            {{ formatDate(publication.updatedAt) }}
          </small>
          <div class="flex gap-1">
            <!-- TODO: show a success/fail message/icon once copied -->
            <UiButton
              variant="ghost"
              size="sm"
              :title="$t('publications.single.share.copyUrl')"
              :aria-label="$t('publications.single.share.copyUrl')"
              class="!px-1 aspect-square"
              @click="copyUrl"
            >
              <Icon name="mdi:link" size="24"  />
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
              :title="$t('publications.single.share.whatsapp')"
              :aria-label="$t('publications.single.share.whatsapp')"
              class="!px-1 aspect-square"
              @click="shareOnWhatsApp"
            >
              <Icon name="mdi:whatsapp" size="24"  />
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
              :title="$t('publications.single.share.twitter')"
              :aria-label="$t('publications.single.share.twitter')"
              class="!px-1 aspect-square"
              @click="shareOnTwitter"
            >
              <Icon name="mdi:twitter" size="24"  />
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Table of Content -->
      <div class="border-b border-colors-neutral-placeholder border-opacity-20 px-2 pb-4 max-w-lg mx-auto">
        <h4 class="font-semibold mb-2">{{ $t('publications.single.tableOfContent') }}</h4>
        <!-- TODO: Table of Content parsing logic — a separate component -->
      </div>

      <!-- Publication Body -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p
        v-if="publication.body"
        class="publication-body font-LTZarid text-base text-pretty text-colors-neutral-foreground leading-relaxed max-w-lg mx-auto"
        v-html="publication.body"
      />
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { StrapiLocale } from '@nuxtjs/strapi'
import type { Publication } from '~/types/strapi'

const { locale } = useI18n()
const { find } = useStrapi()
const route = useRoute()
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

// URL for back to publications
// TODO: add back button
const publicationsUrl = computed(() => {
  const regionParam = route.params.region as string
  if (regionParam) {
    return `/${regionParam}/publications`
  }
  return '/publications'
})

// Date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Current page URL for sharing
const currentUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return ''
})

// NOTE: WIP
const coverUrl = computed(() => {
  // FIXME: for some reason when there's no image it returns https://localhost:1337undefined
  // FIXME: check the media provider, if it's "local" then append api url
  if (!publication.value?.cover?.url || publication.value?.cover?.url.includes("undefined")) {
    return null
  }
  if (publication.value?.cover?.url.startsWith('http')) {
    return publication.value?.cover?.url
  }
  // Ensure only one slash between domain and path
  // FIXME
  return `http://localhost:1337${publication.value?.cover?.url.startsWith('/') ? '' : '/'}${publication.value?.cover?.url}`
})

// Social sharing functions
const copyUrl = async () => {
  if (import.meta.client && navigator.clipboard) {
    try {
      // TODO: could add a toast notification here for success / fail states
      // TODO: use VueUse for the copy logic?
      await navigator.clipboard.writeText(currentUrl.value)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }
}
const shareOnWhatsApp = () => {
  if (import.meta.client && publication.value) {
    const text = encodeURIComponent(`${publication.value.title}\n${currentUrl.value}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }
}

const shareOnTwitter = () => {
  if (import.meta.client && publication.value) {
    const text = encodeURIComponent(publication.value.title)
    const url = encodeURIComponent(currentUrl.value)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }
}

// SEO Meta
useHead(() => ({
  title: publication.value ? publication.value.title : 'Publication',
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
      content: publication.value?.cover?.url || ''
    }
  ]
}))
</script>

<style lang="postcss" scoped>
.chip {
  @apply inline-block px-3 py-1 rounded-xl text-sm font-IBMPlexSansArabic bg-colors-primary-light text-colors-neutral-foreground;
}


.publication-abstract p {
  @apply mb-0;
}

/* Authors and Meta Row */
.authors-meta-row {
  @apply flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4;
  @apply border-b border-colors-neutral-placeholder border-opacity-20 pb-4;
}

.authors {
  @apply font-IBMPlexSansArabic text-base text-colors-neutral-foreground;
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
  
  .authors-meta-row {
    @apply flex-col gap-3;
  }
}

.loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>