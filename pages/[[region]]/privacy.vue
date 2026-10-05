<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading :title="$t('privacy.page.title')" use-h1 />

    <!-- Error State -->
    <div v-if="error" class="py-12">
      <UiMessage :message="$t('privacy.page.error')" type="error">
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
      <UiMessage :message="$t('privacy.page.noContent')" type="info" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StrapiLocale } from '@nuxtjs/strapi'
  import type { PrivacyPage } from '~/types/strapi'

  const { locale } = useI18n()
  const { find } = useStrapi()

  // Set page meta
  useHead({
    title: () => `${$t('privacy.page.title')} — ${$t('homepage.nuha')}`,
  })

  // Fetch privacy page content from Strapi
  const { data, pending, refresh, error } = useAsyncData(
    'privacy-page',
    () =>
      find<PrivacyPage>('privacy-policy', {
        locale: locale.value as StrapiLocale,
        fields: ['title', 'body'],
      }),
    {
      watch: [locale],
      transform: (res) => (Array.isArray(res.data) ? res.data[0] : res.data),
    }
  )
</script>
