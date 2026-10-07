<template>
  <article
    class="partner-card"
    role="button"
    tabindex="0"
    :aria-label="$t('partners.card.openDetails', { name: partner.name })"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
  >
    <PartnerMetaRow
      :country="partner.country"
      :regions="partner.regions"
      class="mb-2"
    />

    <div class="flex gap-4 max-sm:flex-col max-sm:items-start">
      <!-- Logo -->
      <div class="logo-frame">
        <img
          v-if="logoUrl && !logoFailed"
          :src="logoUrl"
          :alt="partner.logo?.alternativeText || partner.name"
          class="max-h-full max-w-full object-contain"
          loading="lazy"
          @error="logoFailed = true"
        />
        <Icon
          v-else
          name="mdi:handshake-outline"
          class="h-10 w-10 text-colors-primary-active"
          aria-hidden="true"
        />
      </div>

      <div class="flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-1">
          <h3 class="font-LTZarid text-h2-m font-semibold lg:text-h2">
            {{ partner.name }}
          </h3>
          <p
            v-if="showShortName"
            class="text-subtext text-colors-neutral-placeholder"
          >
            {{ partner.short_name }}
          </p>
        </div>

        <p
          v-if="partner.description"
          class="line-clamp-3 font-IBMPlexSansArabic text-base text-colors-neutral-foreground"
        >
          {{ partner.description }}
        </p>

        <div class="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span class="read-more inline-flex items-center gap-1 text-subtext">
            {{ $t('partners.card.readMore') }}
            <Icon name="mdi:arrow-right" size="16" class="rtl:rotate-180" />
          </span>

          <!-- stop propagation so following the link does not also open the modal -->
          <a
            v-if="partner.website_url"
            :href="partner.website_url"
            target="_blank"
            rel="noopener noreferrer"
            class="website-link inline-flex items-center gap-1 text-subtext"
            @click.stop
          >
            <Icon name="mdi:open-in-new" size="16" />
            {{ websiteLabel }}
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import type { Partner } from '~/types/strapi'

  const props = defineProps<{
    partner: Partner
  }>()

  const emit = defineEmits<{ open: [] }>()

  const { getMediaUrl } = usePublications()

  const logoUrl = computed(() => getMediaUrl(props.partner.logo?.url))

  // fall back to the placeholder when the logo url itself is broken
  const logoFailed = ref(false)
  watch(logoUrl, () => {
    logoFailed.value = false
  })

  /** the acronym is only worth a line of its own when it differs from the name */
  const showShortName = computed(
    () =>
      !!props.partner.short_name &&
      props.partner.short_name !== props.partner.name
  )

  /** show the bare host rather than the full url, which can be long */
  const websiteLabel = computed(() => {
    const url = props.partner.website_url
    if (!url) return null

    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  })
</script>

<style lang="postcss" scoped>
  .partner-card {
    @apply block w-full cursor-pointer rounded-md bg-colors-neutral-background p-4;
    @apply border border-colors-neutral-placeholder border-opacity-30;
    @apply transition-shadow duration-200 hover:shadow-md;
    @apply transition-colors duration-200 hover:bg-colors-primary-light hover:bg-opacity-50;
    &:focus-visible {
      @apply outline-colors-neutral-foreground;
      outline-width: 2px;
      outline-style: solid;
    }
  }

  .partner-card:hover {
    @apply border-colors-primary border-opacity-20;
    .read-more {
      @apply text-colors-primary-active;
    }
  }

  .logo-frame {
    @apply m-auto flex aspect-square w-40 shrink-0 items-center justify-center overflow-hidden;
    @apply rounded-md border border-colors-neutral-placeholder border-opacity-20 bg-white p-3;
  }

  .read-more {
    @apply font-IBMPlexSansArabic text-colors-neutral-placeholder transition-colors duration-200;
  }

  .website-link {
    @apply font-IBMPlexSansArabic text-colors-primary-active underline underline-offset-4;
    @apply hover:text-colors-primary-hover;
  }
</style>
