<template>
  <div class="authors-meta-row">
    <small
      v-if="authors && authors.length > 0"
      class="font-IBMPlexSansArabic text-colors-neutral-foreground flex-1"
    >
      {{ $t('publications.single.authors') }} 
      {{ authors.map(author => author.name).join(', ') }}
    </small>

    <div class="flex flex-wrap gap-1 items-center">
      <small :title="$t('publications.single.lastUpdated')">
        {{ formattedDate }}
      </small>
      <div class="flex flex-wrap gap-1 items-center">
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.copyUrl')"
          :aria-label="$t('publications.single.share.copyUrl')"
          class="!px-1 aspect-square"
          @click="copyUrl"
        >
          <Icon name="mdi:link" size="24" />
        </UiButton>
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.whatsapp')"
          :aria-label="$t('publications.single.share.whatsapp')"
          class="!px-1 aspect-square"
          @click="shareOnWhatsApp"
        >
          <Icon name="mdi:whatsapp" size="24" />
        </UiButton>
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.twitter')"
          :aria-label="$t('publications.single.share.twitter')"
          class="!px-1 aspect-square"
          @click="shareOnTwitter"
        >
          <Icon name="mdi:twitter" size="24" />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Author } from '~/types/publication';

const { locale } = useI18n();

const props = defineProps<{
  authors?: Author[];
  updatedAt: string;
  url: string;
  title: string;
}>();

// Format the date
const formattedDate = computed(() => {
  return new Date(props.updatedAt).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Social sharing functions
const copyUrl = async () => {
  if (import.meta.client && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(props.url);
      // TODO: could add a toast notification here for success / fail states
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }
};

const shareOnWhatsApp = () => {
  if (import.meta.client && props.title) {
    const text = encodeURIComponent(`${props.title}\n${props.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }
};

const shareOnTwitter = () => {
  if (import.meta.client && props.title) {
    const text = encodeURIComponent(props.title);
    const url = encodeURIComponent(props.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }
};
</script>

<style lang="postcss" scoped>
.authors-meta-row {
  @apply flex flex-wrap items-center md:flex-col lg:justify-between lg:items-center gap-2 my-4;
}
</style>
