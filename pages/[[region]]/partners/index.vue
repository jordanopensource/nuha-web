<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="page-container">
    <!-- Page Heading -->
    <UiPageHeading :title="pageTitle" use-h1>
      <template v-if="pageData?.body" #subtitle>
        <div
          class="intro font-IBMPlexSansArabic text-lead-m lg:text-lead"
          v-html="pageData.body"
        />
      </template>
    </UiPageHeading>

    <!-- Error State -->
    <div v-if="error" class="py-12">
      <UiMessage :message="$t('partners.fetchError')" type="error">
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

    <!-- Partners List -->
    <section v-else-if="partners.length > 0" class="grid grid-cols-1 gap-6">
      <PartnerCard
        v-for="partner in partners"
        :key="partner.documentId"
        :partner="partner"
        @open="openPartner(partner)"
      />
    </section>

    <!-- No Partners -->
    <div v-else class="py-12 text-center">
      <p class="text-lg text-colors-neutral-foreground">
        {{ $t('partners.noPartners') }}
      </p>
    </div>

    <PartnerModal v-model="isModalOpen" :partner="selectedPartner" />
  </div>
</template>

<script lang="ts" setup>
  import type { Partner, PartnersPage } from '~/types/strapi'

  const { locale } = useI18n()
  const { find } = useStrapi()

  // Fetch the editable page heading and intro
  const { data: pageData } = useAsyncData(
    'partners-page',
    () =>
      find<PartnersPage>('partners-page', {
        locale: locale.value,
        fields: ['title', 'body'],
      }),
    {
      watch: [locale],
      transform: (res) => res.data as unknown as PartnersPage,
    }
  )

  // fall back to the bundled translation until the cms entry loads
  const pageTitle = computed(
    () => pageData.value?.title || $t('partners.page.title')
  )

  useHead({
    title: () => `${pageTitle.value} — ${$t('homepage.nuha')}`,
  })

  // Fetch partners; refetched whenever the ui language changes
  const { data, pending, refresh, error } = useAsyncData(
    'partners',
    () =>
      find<Partner>('partners', {
        locale: locale.value,
        populate: {
          logo: true,
          regions: true,
        },
        fields: [
          'name',
          'slug',
          'short_name',
          'description',
          'body',
          'website_url',
          'country',
          'featured',
          'display_order',
        ],
        sort: ['featured:desc', 'display_order:asc', 'name:asc'],
        pagination: {
          pageSize: 100,
        },
      }),
    {
      watch: [locale],
    }
  )

  const partners = computed(() => data.value?.data ?? [])

  const selectedPartner = ref<Partner | null>(null)
  const isModalOpen = ref(false)

  const openPartner = (partner: Partner) => {
    selectedPartner.value = partner
    isModalOpen.value = true
  }

  // the open partner belongs to the previous locale once the language changes
  watch(locale, () => {
    isModalOpen.value = false
    selectedPartner.value = null
  })
</script>

<style lang="postcss" scoped>
  .intro :deep(p) {
    @apply mb-4 last:mb-0;
  }
</style>
