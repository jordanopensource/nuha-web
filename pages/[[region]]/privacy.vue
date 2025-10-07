<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading
      :title="$t('privacy.page.title')"
      use-h1
    />

    <!-- Error State -->
    <div v-if="error" class="py-12">
      <UiMessage
        :message="$t('privacy.page.error')"
        type="error"
      >
        <template #actions>
          <UiButton size="sm" @click="refresh">{{ $t('misc.retry') }}</UiButton>
        </template>
      </UiMessage>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="flex justify-center py-12">
      <div class="text-center">
        <Icon name="mdi:loading" class="loader !h-8 !w-8 mb-4" />
        <p class="text-colors-neutral-foreground">{{ $t('misc.loading') }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="prose">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="font-LTZarid text-xl leading-relaxed" v-html="data.body || ''" />
    </div>

    <!-- Fallback for no content -->
    <div v-else class="py-12 text-center">
      <p class="text-colors-neutral-foreground text-lg">
        {{ $t('privacy.page.error') }}
      </p>
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
  title: () => `${$t('privacy.page.title')} — ${$t('homepage.nuha')}`
})

// Fetch privacy page content from Strapi
const { data, pending, refresh, error } = useAsyncData(
  'privacy-page',
  () => find<PrivacyPage>('privacy-policy', {
    locale: locale.value as StrapiLocale,
    fields: ['title', 'body']
  }),
  {
    watch: [locale],
    transform: (res) => Array.isArray(res.data) ? res.data[0] : res.data
  }
)
</script>

<style lang="postcss" scoped>
.prose :deep(p) {
  @apply mb-4 leading-relaxed;
}

.prose :deep(ul), .prose :deep(ol) {
  @apply mb-4 ms-6;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(em) {
  @apply italic;
}

.prose :deep(blockquote) {
  @apply border-s-4 border-colors-primary border-opacity-30 ps-4 ms-4 italic text-colors-neutral-foreground;
}

.prose :deep(img) {
  @apply rounded-lg shadow-md my-6;
}
</style>
