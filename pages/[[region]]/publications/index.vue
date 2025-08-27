<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading
      :title="$t('publications.page.title')"
      :subtitle="$t('publications.page.subtitle')"
      use-h1
    />

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <div class="text-center">
        <Icon name="mdi:loading" class="loader !h-8 !w-8 mb-4" />
        <p class="text-colors-neutral-foreground">{{ $t('misc.loading', 'Loading...') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <UiMessage
        :message="$t('publications.fetchError')"
        type="error"
      >
        <template #actions>
          <UiButton size="sm" @click="refresh">{{ $t('misc.retry') }}</UiButton>
        </template>
      </UiMessage>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="space-y-8">
      <!-- Featured Publications -->
      <section
        v-if="featuredPublications.length > 0"
        class="border-b border-colors-neutral-placeholder border-opacity-20 pb-8"
      >
        <UiPageHeading
          :title="$t('publications.sections.featured')"
        />
        <div class="grid grid-cols-1 gap-6">
          <PublicationCard
            v-for="publication in featuredPublications"
            :key="publication.documentId"
            :title="publication.title"
            :excerpt="publication.abstract"
            :cover-image-url="publication.cover?.url"
            :category="publication.category?.name"
            :featured="true"
            :slug="publication.slug"
          />
        </div>
      </section>

      <!-- Regular Publications Grid -->
      <section v-if="regularPublications.length > 0" class="publications-grid">
        <UiPageHeading
          :title="$t('publications.sections.allPublications')"
        />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PublicationCard
            v-for="publication in regularPublications"
            :key="publication.documentId"
            :title="publication.title"
            :excerpt="publication.abstract"
            :cover-image-url="publication.cover?.url"
            :category="publication.category?.name"
            :featured="false"
            :slug="publication.slug"
          />
        </div>
      </section>

      <!-- No Publications -->
      <div v-if="publications.length === 0" class="text-center py-12">
        <p class="text-colors-neutral-foreground text-lg">
          {{ $t('publications.noPublications', 'No publications available at the moment.') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StrapiLocale } from '@nuxtjs/strapi'
import type { Publication } from '~/types/strapi'

const { locale } = useI18n()
const { find } = useStrapi()
const { region } = useGeolocation()

// Fetch publications
const { data, pending, refresh, error } = useAsyncData(
  'publications',
  () => find<Publication>('publications', {
    locale: locale.value as StrapiLocale,
    // @ts-expect-error it just works!
    populate: {
      category: true,
      cover: true,
      regions: true,
    },
    fields: ['title', 'abstract', 'slug', 'featured', 'createdAt', 'publishedAt'],
    sort: ['featured:desc', 'publishedAt:desc'],
    filters: {
      regions: {
      // @ts-expect-error it just works!
        code: {
          $eq: region.value?.countryCode?.toLowerCase()
        }
      }
    }
  }),
  {
    server: false,
    watch: [region]
  }
)

// for organizing publications
const publications = computed(() => data.value?.data ?? [])

const featuredPublications = computed(() =>
  publications.value
    .filter(pub => pub.featured)
    .slice(0, 2) // Show max 2 featured
)

const regularPublications = computed(() => 
  publications.value.filter(pub => !pub.featured)
)
</script>
