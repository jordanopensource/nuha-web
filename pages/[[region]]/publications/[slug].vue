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

    <!-- Not translated into the selected language -->
    <div v-else-if="hasNoTranslation" class="my-12">
      <UiMessage
        type="warning"
        :message="
          $t('publications.single.notTranslated', { lang: currentLocaleName })
        "
        class="mx-auto max-w-2xl !bg-amber-50"
      >
        <template #actions>
          <div class="flex flex-wrap gap-2">
            <UiButton
              v-if="availableLocale"
              size="sm"
              @click="switchToAvailableLocale"
            >
              {{
                $t('publications.single.viewInLang', {
                  lang: availableLocaleName,
                })
              }}
            </UiButton>
            <UiButton
              :to="$localePath(publicationsUrl)"
              size="sm"
              variant="outline"
            >
              {{ $t('publications.single.backToPublications') }}
            </UiButton>
          </div>
        </template>
      </UiMessage>
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
      class="grid w-full grid-cols-4 gap-0.5 max-md:grid-cols-1"
    >
      <div class="col-span-full col-start-1">
        <PublicationCategoriesRow
          :category="publication.category"
          :regions="publication.regions"
          class="mx-auto mb-4 max-w-lg md:hidden"
        />

        <!-- Title -->
        <h1
          class="mx-auto mb-4 w-full text-pretty px-8 text-center font-LTZarid"
        >
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
        <div v-if="coverUrl" class="my-4 w-full max-w-full px-8">
          <img
            :src="coverUrl"
            :alt="publication.cover?.alternativeText || publication.title"
            class="mx-auto h-auto w-full rounded-md object-cover shadow-sm"
          />
        </div>

        <!-- Authors and Meta Row -->
        <div class="my-4 flex max-w-lg flex-col gap-2">
          <div class="mx-auto md:!hidden">
            <PublicationMetaRow
              :authors="publication.authors"
              :updated-at="publication.updatedAt"
              :url="currentUrl"
              :title="publication.title"
            />
          </div>

          <!-- Table of Content -->
          <div class="mx-auto w-full md:hidden">
            <PublicationToC
              class="rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4 pt-0"
              :headings="processedBody.headings"
            />
          </div>
        </div>

        <div class="grid w-full grid-cols-4 gap-0.5 max-md:grid-cols-1">
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
                class="max-h-[40vh] overflow-y-auto rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4 pt-0"
                :headings="processedBody.headings"
              />
              <!-- Side Attachments -->
              <PublicationAttachments
                class="max-h-[40vh] overflow-y-auto rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4 pt-0"
                :attachments="publication.attachments"
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
          <!-- Publication Body -->
          <div
            v-if="publication.body"
            class="publication-body col-span-full col-start-2 max-w-[34rem] px-8 text-pretty font-LTZarid text-base leading-normal text-colors-neutral-foreground"
            v-html="processedBody.html"
          />
        </div>
        <!-- Attachments -->
        <div class="mx-auto w-full md:hidden">
          <PublicationAttachments
            class="rounded-md border border-colors-neutral-placeholder border-opacity-20 p-4 pt-0"
            :attachments="publication.attachments"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
  import type { StrapiLocale } from '@nuxtjs/strapi'
  import type { Publication } from '~/types/strapi'

  type PublicationWithLocalizations = Publication & {
    localizations?: { slug: string; locale: string }[]
  }

  const { processBody, getPublicationCoverUrl } = usePublications()
  const { locale, locales, setLocale } = useI18n()
  const { find } = useStrapi()
  const route = useRoute()
  const localePath = useLocalePath()
  // const { region } = useGeolocation()

  const slug = computed(() => route.params.slug as string)

  const cacheKey = computed(() => `publication-${locale.value}-${slug.value}`)

  const findBySlug = (targetSlug: string, targetLocale: string) =>
    find<PublicationWithLocalizations>('publications', {
      locale: targetLocale as StrapiLocale,
      populate: {
        category: true,
        cover: true,
        attachments: true,
        regions: true,
        authors: true,
        localizations: { fields: ['slug', 'locale'] },
      },
      filters: {
        slug: {
          $eq: targetSlug,
        },
        // regions: {
        //   // @ts-expect-error it just works!
        //   code: {
        //     $eq: region.value?.countryCode?.toLowerCase()
        //   }
        // }
      },
    })

  const findSlugOwner = async (targetSlug: string, exclude: string) => {
    const others = locales.value
      .map((l) => l.code)
      .filter((code) => code !== exclude)

    const matches = await Promise.all(
      others.map((code) =>
        findBySlug(targetSlug, code)
          .then((res) => res.data?.[0] ?? null)
          .catch(() => null)
      )
    )

    return matches.find(Boolean) ?? null
  }

  // Fetch single publication
  const { data, pending, error } = useAsyncData(
    cacheKey,
    async () => {
      const direct = await findBySlug(slug.value, locale.value)
      if (direct.data?.[0]) {
        return { publication: direct.data[0] }
      }

      const owner = await findSlugOwner(slug.value, locale.value)
      // no language knows this slug
      if (!owner) return {}

      const translation = owner.localizations?.find(
        (l) => l.locale === locale.value
      )

      // translated, but different slug
      if (translation) return { redirectSlug: translation.slug }

      // exists in different lang
      return { availableLocale: owner.locale }
    },
    {
      server: false,
      watch: [slug, locale],
    }
  )

  const publication = computed(() => data.value?.publication)
  const availableLocale = computed(() => data.value?.availableLocale ?? null)
  const hasNoTranslation = computed(() => !!availableLocale.value)

  watch(
    () => data.value?.redirectSlug,
    (redirectSlug) => {
      if (!redirectSlug || redirectSlug === slug.value) return
      navigateTo(localePath(publicationUrl(redirectSlug)), { replace: true })
    },
    { immediate: true }
  )

  const processedBody = computed(() => processBody(publication.value?.body))

  // URL for back to publications
  const publicationsUrl = computed(() => {
    const regionParam = route.params.region as string
    if (regionParam) {
      return `/${regionParam}/publications`
    }
    return '/publications'
  })

  const publicationUrl = (publicationSlug: string) =>
    `${publicationsUrl.value}/${publicationSlug}`

  const localeName = (code?: string | null) =>
    (locales.value.find((l) => l.code === code)?.name as string) || code || ''

  const currentLocaleName = computed(() => localeName(locale.value))
  const availableLocaleName = computed(() => localeName(availableLocale.value))

  const switchToAvailableLocale = async () => {
    if (availableLocale.value)
      await setLocale(availableLocale.value as StrapiLocale)
  }

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

  /* Tables */
  .publication-body :deep(table) {
    @apply my-2 w-full border-collapse;
  }

  .publication-body :deep(th),
  .publication-body :deep(td) {
    @apply border border-colors-neutral-placeholder border-opacity-20 px-3 py-2 text-start align-top;
  }

  .publication-body :deep(th) {
    @apply bg-colors-neutral-background font-semibold;
  }

  .publication-body :deep(caption) {
    @apply mb-2 text-start text-subtext text-colors-neutral-placeholder;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .publication-title {
      @apply text-h1-m;
    }
  }
</style>
