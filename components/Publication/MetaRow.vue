<template>
  <div class="authors-meta-row">
    <small
      v-if="authors && authors.length > 0"
      class="flex-1 font-IBMPlexSansArabic text-colors-neutral-foreground"
    >
      {{ $t('publications.single.authors') }}
      {{ authors.map((author) => author.name).join(', ') }}
    </small>

    <div class="flex flex-wrap items-center gap-1">
      <small :title="$t('publications.single.lastUpdated')">
        {{ formattedDate }}
      </small>
      <div class="flex flex-wrap items-center gap-1">
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.copyUrl')"
          :aria-label="$t('publications.single.share.copyUrl')"
          class="aspect-square !px-1"
          @click="handleCopyUrl"
        >
          <Icon name="mdi:link" size="24" />
        </UiButton>
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.whatsapp')"
          :aria-label="$t('publications.single.share.whatsapp')"
          class="aspect-square !px-1"
          @click="shareOnWhatsApp"
        >
          <Icon name="mdi:whatsapp" size="24" />
        </UiButton>
        <UiButton
          variant="ghost"
          size="sm"
          :title="$t('publications.single.share.twitter')"
          :aria-label="$t('publications.single.share.twitter')"
          class="aspect-square !px-1"
          @click="shareOnTwitter"
        >
          <Icon name="mdi:twitter" size="24" />
        </UiButton>
      </div>
    </div>

    <!-- Toast notification for copy success -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div v-if="showToast" class="fixed end-4 top-4 z-50 max-w-sm sm:!static">
        <UiMessage
          type="success"
          :message="$t('publications.single.share.urlCopied')"
          show-close-button
          @close="showToast = false"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import type { Author } from '~/types/publication'

  const { locale } = useI18n()

  const props = defineProps<{
    authors?: Author[]
    updatedAt: string
    url: string
    title: string
  }>()

  const { copy } = useClipboard({ legacy: true })

  // Toast state
  const showToast = ref(false)
  let toastTimeout: NodeJS.Timeout | null = null

  // Format the date
  const formattedDate = computed(() => {
    return new Date(props.updatedAt).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  })

  // Copy URL function with toast notification
  const handleCopyUrl = async () => {
    try {
      await copy(props.url)

      // clear any existing timeout
      if (toastTimeout) {
        clearTimeout(toastTimeout)
      }

      // show toast and auto-hide
      showToast.value = true
      toastTimeout = setTimeout(() => {
        showToast.value = false
      }, 1500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // clean up timeout
  onUnmounted(() => {
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }
  })

  // Social sharing functions
  const shareOnWhatsApp = () => {
    if (import.meta.client && props.title) {
      const text = encodeURIComponent(`${props.title}\n${props.url}`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  const shareOnTwitter = () => {
    if (import.meta.client && props.title) {
      const text = encodeURIComponent(props.title)
      const url = encodeURIComponent(props.url)
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        '_blank'
      )
    }
  }
</script>

<style lang="postcss" scoped>
  .authors-meta-row {
    @apply my-4 flex flex-wrap items-center gap-2 md:flex-col lg:items-center lg:justify-between;
  }
</style>
