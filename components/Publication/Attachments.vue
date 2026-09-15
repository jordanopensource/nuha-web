<script setup lang="ts">
  import type { Attachment } from '~/types/publication'

  defineProps<{
    attachments?: Attachment[]
  }>()

  const { locale } = useI18n()
  const { getMediaUrl } = usePublications()

  const downloadingId = ref<number | null>(null)

  const isPdf = (file: Attachment) => file.mime === 'application/pdf'

  const iconFor = (file: Attachment) => {
    if (isPdf(file)) return 'mdi:file-pdf-box'
    if (file.mime.startsWith('image/')) return 'mdi:file-image-outline'
    if (file.mime.startsWith('video/')) return 'mdi:file-video-outline'
    if (file.mime.startsWith('audio/')) return 'mdi:file-music-outline'
    if (file.mime.startsWith('text/')) return 'mdi:file-document-outline'

    if (
      file.mime ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mime === 'application/vnd.ms-excel'
    )
      return 'mdi:file-excel-outline'

    if (
      file.mime ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mime === 'application/msword'
    )
      return 'mdi:file-word-outline'
    return 'mdi:file-outline'
  }

  const formatSize = (sizeInKb: number) => {
    if (!Number.isFinite(sizeInKb)) return ''

    const inMb = sizeInKb >= 1024
    return new Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: inMb ? 'megabyte' : 'kilobyte',
      unitDisplay: 'short',
      maximumFractionDigits: inMb ? 1 : 0,
    }).format(inMb ? sizeInKb / 1024 : sizeInKb)
  }

  const handleDownload = async (file: Attachment) => {
    const url = getMediaUrl(file.url)
    if (!url) return

    downloadingId.value = file.id
    try {
      const blob = await $fetch<Blob>(url, { responseType: 'blob' })
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = objectUrl
      link.download = file.name

      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch (err) {
      console.error('Failed to download attachment:', err)
      window.open(url, '_blank', 'noopener')
    } finally {
      downloadingId.value = null
    }
  }
</script>

<template>
  <section v-if="attachments?.length" class="attachments font-LTZarid">
    <h4
      class="mb-2 border-b border-b-colors-neutral-placeholder border-opacity-20 pb-1 font-bold"
    >
      {{ $t('publications.single.attachments.title') }}
    </h4>

    <ul class="flex flex-col gap-1">
      <li
        v-for="file in attachments"
        :key="file.id"
        class="flex items-center gap-2 font-IBMPlexSansArabic"
      >
        <Icon
          :name="iconFor(file)"
          size="22"
          class="shrink-0 text-colors-neutral-placeholder"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm" :title="file.name">{{ file.name }}</p>
          <small class="text-colors-neutral-placeholder">
            {{ formatSize(file.size) }}
          </small>
        </div>

        <div class="flex shrink-0 items-center">
          <UiButton
            v-if="isPdf(file) && getMediaUrl(file.url)"
            variant="ghost"
            size="sm"
            :to="getMediaUrl(file.url)!"
            target="_blank"
            :title="$t('publications.single.attachments.view')"
            :aria-label="$t('publications.single.attachments.view')"
            class="aspect-square !p-2"
          >
            <Icon name="mdi:eye-outline" size="20" />
          </UiButton>

          <UiButton
            variant="ghost"
            size="sm"
            :loading="downloadingId === file.id"
            :title="$t('publications.single.attachments.download')"
            :aria-label="$t('publications.single.attachments.download')"
            class="aspect-square !p-2"
            @click="handleDownload(file)"
          >
            <Icon
              v-if="!(downloadingId === file.id)"
              name="mdi:download"
              size="20"
            />
            <template #loading>
              <Icon name="mdi:loading" size="20" class="loader" />
            </template>
          </UiButton>
        </div>
      </li>
    </ul>
  </section>
</template>
