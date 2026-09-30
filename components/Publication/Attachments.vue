<script setup lang="ts">
  import type { Attachment } from '~/types/publication'

  defineProps<{
    attachments?: Attachment[]
  }>()

  const { locale } = useI18n()
  const { getMediaUrl } = usePublications()

  const downloadingId = ref<number | null>(null)
  const failedDownload = ref<string | null>(null)
  const isOpen = ref(true)
  const listId = useId()

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
    if (!file || !url) {
      failedDownload.value = file.name
      return
    }

    downloadingId.value = file.id
    failedDownload.value = null
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

      const opened = window.open(url, '_blank')
      if (opened) {
        opened.opener = null
      } else {
        failedDownload.value = file.name
      }
    } finally {
      downloadingId.value = null
    }
  }
</script>

<template>
  <section v-if="attachments?.length" class="attachments font-LTZarid">
    <h4
      class="sticky top-0 z-10 flex items-center justify-between gap-2 border-b-colors-neutral-placeholder border-opacity-20 bg-colors-neutral-background pt-4 font-bold"
      :class="{ 'border-b pb-1': isOpen }"
    >
      {{ $t('publications.single.attachments.title') }}
      <UiButton
        variant="ghost"
        size="sm"
        class="aspect-square shrink-0 !rounded-full !p-1"
        :title="
          isOpen
            ? $t('publications.single.attachments.collapse')
            : $t('publications.single.attachments.expand')
        "
        :aria-expanded="isOpen"
        :aria-controls="listId"
        @click="isOpen = !isOpen"
      >
        <Icon
          name="mdi:chevron-down"
          size="20"
          class="transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </UiButton>
    </h4>

    <UiMessage
      v-if="failedDownload"
      type="error"
      class="sticky top-14 z-[5] mt-2 text-sm"
      :message="
        $t('publications.single.attachments.downloadFailed', {
          name: failedDownload,
        })
      "
      show-close-button
      @close="failedDownload = null"
    />

    <div
      :id="listId"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!isOpen"
    >
      <ul class="flex flex-col gap-1 overflow-hidden pt-2">
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
    </div>
  </section>
</template>
