<template>
  <UiModal
    v-model="isOpen"
    :title="partner?.name ?? ''"
    size="lg"
    :show-action-button="!!partner?.website_url"
    :action-button-text="$t('partners.modal.visitWebsite')"
    action-button-variant="primary"
    :cancel-button-text="$t('misc.close')"
    show-cancel-button
    @action="visitWebsite"
  >
    <div v-if="partner" class="flex flex-col gap-4">
      <PartnerMetaRow :country="partner.country" :regions="partner.regions" />

      <div class="flex items-start gap-6 max-sm:flex-col">
        <div v-if="logoUrl" class="logo-frame">
          <img
            :src="logoUrl"
            :alt="partner.logo?.alternativeText || partner.name"
            class="max-h-full max-w-full object-contain"
          />
        </div>

        <div class="flex flex-col gap-2">
          <p
            v-if="showShortName"
            class="text-subtext text-colors-neutral-placeholder"
          >
            {{ partner.short_name }}
          </p>
          <p
            v-if="partner.description"
            class="font-IBMPlexSansArabic text-lead-m text-colors-neutral-foreground"
          >
            {{ partner.description }}
          </p>
          <a
            v-if="partner.website_url"
            :href="partner.website_url"
            target="_blank"
            rel="noopener noreferrer"
            class="website-link inline-flex w-max items-center gap-1 text-subtext"
          >
            <Icon name="mdi:open-in-new" size="16" />
            {{ websiteLabel }}
          </a>
        </div>
      </div>

      <UiProseBody
        v-if="partner.body"
        :html="partner.body"
        class="!max-w-none"
      />

      <p
        v-else-if="!partner.description"
        class="py-4 text-center text-colors-neutral-placeholder"
      >
        {{ $t('partners.modal.noDetails') }}
      </p>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
  import type { Partner } from '~/types/strapi'

  const props = defineProps<{
    modelValue: boolean
    partner: Partner | null
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const { getMediaUrl } = usePublications()

  const logoUrl = computed(() => getMediaUrl(props.partner?.logo?.url))

  const showShortName = computed(
    () =>
      !!props.partner?.short_name &&
      props.partner.short_name !== props.partner.name
  )

  const websiteLabel = computed(() => {
    const url = props.partner?.website_url
    if (!url) return null

    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  })

  const visitWebsite = () => {
    if (props.partner?.website_url) {
      window.open(props.partner.website_url, '_blank', 'noopener,noreferrer')
    }
  }
</script>

<style lang="postcss" scoped>
  .logo-frame {
    @apply flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden;
    @apply rounded-md border border-colors-neutral-placeholder border-opacity-20 bg-white p-3;
  }

  .website-link {
    @apply font-IBMPlexSansArabic text-colors-primary-active underline underline-offset-4;
    @apply hover:text-colors-primary-hover;
  }
</style>
