<template>
  <div class="page-container">
    <UiPageHeading class="max-md:gap-8">
      <template #title>
        <div class="flex flex-col h-full gap-8">
          <h1>{{ $t('homepage.nuha') }}</h1>
          <p class="font-LTZarid text-2xl">
            {{ $t('homepage.subtitle') }}
          </p>
          <div class="flex gap-4 flex-wrap mt-auto max-sm:justify-center">
            <LazyUiRegionLanguageSelector size="lg" mode="region" show-flag-in-button />
            <!-- TODO: change the text of this button -->
            <UiButton
              size="lg"
              :to="$localePath('/analyze')"
            >
              {{ $t('homepage.getStarted') }}
              <template #icon>
                <Icon name="mdi:arrow-right" class="rtl:rotate-180" size="24" />
              </template>
            </UiButton>
          </div>
        </div>
      </template>
      <template #second-col>
        <img src="~/assets/images/loving_doodle.svg" loading="lazy" alt="doodle" width="480" class="ms-auto max-lg:mx-auto">
      </template>
    </UiPageHeading>

    <UiPageHeading>
      <template #title>
        <div class="flex flex-col h-full gap-8">
          <h2>{{ $t('homepage.howItWorks') }}</h2>
          <p class="font-LTZarid text-2xl">
            {{ $t('homepage.howItWorksSubtitle') }}
          </p>
        </div>
      </template>
      <template #second-col>
        <UiButton
          size="md"
          variant="outline"
          class="w-max md:ms-auto my-auto"
          :to="$localePath('/about')"
        >
          {{ $t('homepage.learnMore') }}
        </UiButton>
      </template>
    </UiPageHeading>

    <div
      v-if="!error && publications?.data && publications.data.length > 0"
      class="flex flex-col gap-4"
    >
      <UiPageHeading :title="$t('homepage.ourPublications')" />
  
      <div
        v-if="!pending"
        class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-28 gap-y-6"
      >
        <PublicationCard
          v-for="publication in publications?.data"
          :key="publication.documentId"
          :title="publication.title"
          :excerpt="publication.abstract"
          :cover-image-url="publication.cover?.url"
          :category="publication.category?.name"
          :featured="false"
          :slug="publication.slug"
        />
      </div>
      <Icon v-else name="mdi:loading" class="loader !h-8 !w-8 mb-4" />
      <UiButton
        size="md"
        variant="outline"
        class="w-max ms-auto"
        :to="$localePath('/publications')"
      >
        {{ $t('homepage.readMore') }}
      </UiButton>
    </div>


  </div>
</template>
<script setup lang="ts">
import type { PaginationByOffset, StrapiLocale } from '@nuxtjs/strapi'
import type { Publication } from '~/types/strapi'

const { locale } = useI18n()
const { find } = useStrapi()
const { region } = useGeolocation()

// Fetch publications
const { data: publications, pending, error } = useAsyncData(
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
    pagination: {
      limit: 2,
    } as PaginationByOffset,
    filters: {
      regions: {
        // @ts-expect-error it just works!
        code: {
          $eq: region.value?.countryCode?.toLowerCase()
        }
      },
    }
  }),
  {
    server: false,
    watch: [region]
  }
)
</script>
<style lang="postcss" scoped></style>