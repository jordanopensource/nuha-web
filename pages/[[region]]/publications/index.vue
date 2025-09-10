<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading
      :title="$t('publications.page.title')"
      :subtitle="$t('publications.page.subtitle')"
      use-h1
    />

    <!-- Error State -->
    <div v-if="error" class="py-12">
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
    <div class="space-y-8">
      <!-- Featured Publications - only show when no category is selected -->
      <section
        v-if="data && featuredPublications.length > 0"
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

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center py-12">
        <div class="text-center">
          <Icon name="mdi:loading" class="loader !h-8 !w-8 mb-4" />
          <p class="text-colors-neutral-foreground">{{ $t('misc.loading', 'Loading...') }}</p>
        </div>
      </div>
      <!-- Regular Publications Grid -->
      <section v-else-if="data && regularPublications.length > 0" class="publications-grid">
        <UiPageHeading
          :title="selectedCategoryId === null 
            ? $t('publications.sections.allPublications')
            : getCurrentCategoryName"
        />

        <!-- Category Filter Buttons -->
        <div v-if="categoriesData && !categoriesError" class="mb-4">
          <div class="mt-2 mb-1">
            <small class="text-colors-neutral-foreground text-opacity-80">{{ $t('publications.categories.filter') }}</small>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiButton 
              size="sm"
              :variant="selectedCategoryId === null ? 'primary' : 'ghost'"
              @click="selectedCategoryId = null"
            >
              {{ $t('publications.categories.all') }}
            </UiButton>
            <UiButton
              v-for="category in categoriesData"
              :key="category.id"
              size="sm"
              :variant="selectedCategoryId === category.id ? 'primary' : 'ghost'"
              @click="selectedCategoryId = category.id"
            >
              {{ category.name }}
            </UiButton>

            <!-- TODO: change region selector title -->
            <UiRegionLanguageSelector
              size="sm"
              class="ms-auto"
              button-variant="ghost"
              show-flag-in-button
              button-content="both"
              mode="region"
            />
          </div>
        </div>

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
      <div v-if="data && publications.length === 0" class="py-12 flex flex-col gap-4 justify-center items-center">
        <p class="text-colors-neutral-foreground text-lg">
          {{ 
            selectedCategoryId !== null 
              ? $t('publications.noPublications', 'No publications available for this category.') 
              : $t('publications.noPublications', 'No publications available at the moment.') 
          }}
        </p>
        <div v-if="selectedCategoryId !== null" class="mt-4">
          <UiButton size="sm" @click="selectedCategoryId = null">
            {{ $t('publications.categories.all') }}
          </UiButton>
        </div>
        <!-- TODO: change title -->
        <UiRegionLanguageSelector
          size="sm"
          button-variant="ghost"
          show-flag-in-button
          button-content="both"
          mode="region"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StrapiLocale } from '@nuxtjs/strapi'
import type { Publication, PublicationCategory } from '~/types/strapi'

const { locale } = useI18n()
const { find } = useStrapi()
const { region } = useGeolocation()

// track the selected category
const selectedCategoryId = ref<number | null>(null)

// fetch all categories
const { data: categoriesData, error: categoriesError } = useAsyncData(
  'publication-categories',
  () => find<PublicationCategory>('categories', {
    locale: locale.value as StrapiLocale,
    fields: ['name', 'slug', 'id'],
    sort: ['name:asc']
  }),
  {
    server: false,
    watch: [region],
    transform: (res) => res.data
  }
)

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
      },
      ...(selectedCategoryId.value !== null && {
        category: {
          id: {
            $eq: selectedCategoryId.value
          }
        }
      })
    }
  }),
  {
    server: false,
    watch: [region, selectedCategoryId]
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

// get the name of the currently selected category
const getCurrentCategoryName = computed(() => {
  if (selectedCategoryId.value === null) {
    return $t('publications.sections.allPublications')
  }
  
  const selectedCategory = categoriesData.value?.find(cat => cat.id === selectedCategoryId.value)
  return selectedCategory?.name || $t('publications.sections.allPublications')
})
</script>

