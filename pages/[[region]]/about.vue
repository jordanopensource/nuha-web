<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading :title="$t('about.page.title')" use-h1 />

    <!-- Error State -->
    <div v-if="error" class="py-12">
      <UiMessage :message="$t('about.page.error')" type="error">
        <template #actions>
          <UiButton size="sm" @click="refresh">{{ $t('misc.retry') }}</UiButton>
        </template>
      </UiMessage>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="flex justify-center py-12">
      <div class="text-center">
        <Icon name="mdi:loading" class="loader mb-4 !h-8 !w-8" />
        <p class="text-colors-neutral-foreground">{{ $t('misc.loading') }}</p>
      </div>
    </div>

    <!-- Content -->
    <UiProseBody v-else-if="data" :html="data.body || ''" />

    <!-- Empty State -->
    <div v-else class="py-12">
      <UiMessage :message="$t('about.page.noContent')" type="info" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StrapiLocale } from '@nuxtjs/strapi'
  import type { AboutPage } from '~/types/strapi'

  const { locale } = useI18n()
  const { find } = useStrapi()

  // Set page meta
  useHead({
    title: () => `${$t('about.page.title')} — ${$t('homepage.nuha')}`,
  })

  // Fetch about page content from Strapi
  const { data, pending, refresh, error } = useAsyncData(
    'about-page',
    () =>
      find<AboutPage>('about-page', {
        locale: locale.value as StrapiLocale,
        fields: ['title', 'body'],
      }),
    {
      watch: [locale],
      transform: (res) => res.data as unknown as AboutPage,
    }
  )
</script>
