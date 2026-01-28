<template>
  <UiModal
    v-model="isOpen"
    :title="$t('analyze.results.download.title')"
    :show-footer="false"
    size="md"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <p class="text-center text-colors-neutral-foreground opacity-80">
        {{ $t('analyze.results.download.subtitle') }}
      </p>
      <!-- Error Message -->
      <UiMessage
        v-if="showError"
        type="error"
        :message="downloadError"
        show-close-button
        @close="showError = false"
      />

      <div class="grid grid-cols-1 gap-3">
        <!-- XLSX Download (Highlighted) -->
        <UiButton
          variant="outline"
          size="lg"
          class="h-auto p-4"
          :disabled="downloading"
          @click="downloadXLSX"
        >
          <template #icon>
            <Icon name="mdi:file-excel" size="24" />
          </template>
          <div class="flex-1 text-start">
            <div class="font-bold">
              {{ $t('analyze.results.download.xlsx') }}
            </div>
            <div class="mt-1 text-sm opacity-70">
              {{ $t('analyze.results.download.xlsxDescription') }}
            </div>
            <div class="mt-1 flex items-center gap-1 text-sm opacity-90">
              <Icon name="mdi:star" size="18" />
              {{ $t('analyze.help.fileUpload.excelHint') }}
            </div>
          </div>
        </UiButton>

        <!-- PDF Download -->
        <UiButton
          variant="ghost"
          size="lg"
          class="h-auto border border-colors-neutral-foreground border-opacity-20 p-4"
          :disabled="downloading"
          @click="downloadPDF"
        >
          <template #icon>
            <Icon name="mdi:file-pdf-box" size="24" class="text-red-600" />
          </template>
          <div class="flex-1 text-start">
            <div class="font-medium">
              {{ $t('analyze.results.download.pdf') }}
            </div>
            <div class="mt-1 text-sm opacity-70">
              {{ $t('analyze.results.download.pdfDescription') }}
            </div>
          </div>
        </UiButton>

        <!-- JSON Download -->
        <UiButton
          variant="ghost"
          size="lg"
          class="h-auto border border-colors-neutral-foreground border-opacity-20 p-4"
          :disabled="downloading"
          @click="downloadJSON"
        >
          <template #icon>
            <Icon name="mdi:code-json" size="24" class="text-blue-600" />
          </template>
          <div class="flex-1 text-start">
            <div class="font-medium">
              {{ $t('analyze.results.download.json') }}
            </div>
            <div class="mt-1 text-sm opacity-70">
              {{ $t('analyze.results.download.jsonDescription') }}
            </div>
          </div>
        </UiButton>

        <!-- CSV Download -->
        <UiButton
          variant="ghost"
          size="lg"
          class="h-auto border border-colors-neutral-foreground border-opacity-20 p-4"
          :disabled="downloading"
          @click="downloadCSV"
        >
          <template #icon>
            <Icon name="mdi:file-table" size="24" class="text-green-600" />
          </template>
          <div class="flex-1 text-start">
            <div class="font-medium">
              {{ $t('analyze.results.download.csv') }}
            </div>
            <div class="mt-1 text-sm opacity-70">
              {{ $t('analyze.results.download.csvDescription') }}
            </div>
          </div>
        </UiButton>
      </div>

      <!-- Loading State -->
      <div
        v-if="downloading"
        class="mt-4 flex items-center justify-center gap-2 text-colors-primary"
      >
        <Icon name="mdi:loading" size="20" class="animate-spin" />
        <span>{{ $t('analyze.results.download.downloading') }}</span>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
  import type { AIAnalysisResponse } from '~/types/analyze'

  interface Props {
    modelValue: boolean
    analysisData: AIAnalysisResponse | null
    onPrintPDF?: () => void
  }

  interface Emits {
    'update:modelValue': [value: boolean]
    close: []
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const { t } = useI18n()

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const downloading = ref(false)
  const downloadError = ref('')
  const showError = ref(false)

  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    if (type === 'error') {
      console.error(message)
      downloadError.value = message
      showError.value = true
    }
  }

  const downloadFile = async (endpoint: string, filename: string) => {
    if (!props.analysisData) {
      showNotification(t('analyze.results.download.downloadError'), 'error')
      return
    }

    downloading.value = true

    try {
      const response = await $fetch(endpoint, {
        method: 'POST',
        body: {
          data: props.analysisData,
        },
      })

      let fileContent: string
      let mimeType: string

      if (endpoint.includes('csv')) {
        // CSV response is already a string
        fileContent = response as string
        mimeType = 'text/csv;charset=utf-8'
      } else {
        // JSON response needs to be stringified if it's an object
        fileContent =
          typeof response === 'string'
            ? response
            : JSON.stringify(response, null, 2)
        mimeType = 'application/json'
      }

      // Create blob and download
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), fileContent], {
        type: mimeType,
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showNotification(t('analyze.results.download.downloadSuccess'))
    } catch (error) {
      console.error('Download error:', error)
      showNotification(t('analyze.results.download.downloadError'), 'error')
    } finally {
      downloading.value = false
    }
  }

  const downloadPDF = () => {
    if (props.onPrintPDF) {
      isOpen.value = false
      // wait for modal to close and page to re-render before printing
      nextTick(() => {
        setTimeout(() => {
          props.onPrintPDF!()
        }, 200)
      })
    }
  }

  const downloadXLSX = async () => {
    if (!props.analysisData) {
      showNotification(t('analyze.results.download.downloadError'), 'error')
      return
    }

    downloading.value = true

    try {
      const response = await $fetch('/api/analyze/download/xlsx', {
        method: 'POST',
        body: {
          data: props.analysisData,
        },
        responseType: 'arrayBuffer',
      })

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5)

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `nuha_analysis_results_${timestamp}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showNotification(t('analyze.results.download.downloadSuccess'))
    } catch (error) {
      console.error('Download error:', error)
      showNotification(t('analyze.results.download.downloadError'), 'error')
    } finally {
      downloading.value = false
    }
  }

  const downloadCSV = () => {
    // ISO 8601 format: YYYY-MM-DDTHH-MM-SS
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    downloadFile(
      '/api/analyze/download/csv',
      `nuha_analysis_results_${timestamp}.csv`
    )
  }

  const downloadJSON = () => {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    downloadFile(
      '/api/analyze/download/json',
      `nuha_analysis_results_${timestamp}.json`
    )
  }
</script>

<style scoped lang="postcss">
  .download-option {
    @apply flex items-center gap-4 rounded-lg border border-colors-neutral-foreground border-opacity-20 p-4 transition-all;
  }

  .download-option:hover {
    @apply border-colors-primary border-opacity-40 bg-colors-primary-light bg-opacity-5;
  }

  .download-option:disabled {
    @apply cursor-not-allowed opacity-50;
  }
</style>
