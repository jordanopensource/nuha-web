<template>
  <form class="mx-auto w-full lg:max-w-3xl" @submit.prevent="handleSubmit">
    <!-- Form header -->
    <div class="flex justify-start">
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{ 'selected-method-style': selectedMethod === 0 }"
        @click="selectMethod(0)"
      >
        {{ $t('analyze.form.textInput') }}
      </ui-button>
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{ 'selected-method-style': selectedMethod === 1 }"
        @click="selectMethod(1)"
      >
        {{ $t('analyze.form.fileUpload') }}
      </ui-button>
    </div>
    <div
      class="flex flex-col gap-2 rounded-md border border-colors-primary-light bg-white p-4 lg:px-8"
      :class="{
        'ltr:rounded-tl-none rtl:rounded-tr-none': selectedMethod === 0,
      }"
    >
      <div class="flex justify-between py-2">
        <ui-region-language-selector
          :title="$t('analyze.form.regionTitle')"
          mode="region"
          button-variant="ghost"
          show-flag-in-button
        />
        <ui-button
          variant="ghost"
          :aria-label="$t('analyze.form.help')"
          :title="$t('analyze.form.help')"
          class="md:!hidden"
          @click.prevent="showHelpModal = true"
        >
          <template #icon>
            <Icon
              name="mdi:help-circle-outline"
              class="text-colors-primary"
              size="24"
            />
          </template>
        </ui-button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4">
        <ui-message
          type="error"
          :message="errorMessage"
          show-close-button
          @close="clearError"
        />
      </div>

      <div>
        <UiXTransition :direction-value="selectedMethod">
          <div v-if="selectedMethod === 0">
            <ui-text-area
              key="text-input"
              v-model="textInput"
              :modal-label="$t('analyze.form.textInput')"
              :placeholder="
                dialectDisplay
                  ? $t('analyze.help.textInput.sampleText', {
                      dialect: dialectDisplay,
                    })
                  : $t('analyze.form.textPlaceholder')
              "
              :required="true"
            />
          </div>
          <div v-else>
            <ui-file-input
              key="file-input"
              :placeholder="$t('analyze.form.filePlaceholder')"
              @error="(message) => onFileError(message)"
              @update:file="(file) => (selectedFile = file.data)"
            />
          </div>
        </UiXTransition>
      </div>
      <ui-button
        size="lg"
        class="mx-auto mt-4"
        type="submit"
        :loading="isLoading"
      >
        {{ isLoading ? $t('misc.loading') : $t('links.general.analyze') }}
        <template #icon>
          <Icon name="mdi:arrow-right" size="24" class="rtl:rotate-180" />
        </template>
      </ui-button>
    </div>

    <!-- Help Modal - only visible on small screens -->
    <UiModal
      v-model="showHelpModal"
      :title="$t('analyze.help.title')"
      :show-action-button="false"
      :cancel-button-text="$t('misc.close')"
      :close-aria-label="$t('misc.close')"
      size="md"
      class="md:hidden"
      @cancel="showHelpModal = false"
    >
      <analyze-text-input-help v-if="selectedMethod === 0" />
      <analyze-file-upload-help v-else />
    </UiModal>
  </form>
</template>
<script setup lang="ts">
  import {
    MAX_FILE_SIZE_BYTES,
    ACCEPTED_MIME_TYPES,
    bytesToMB,
  } from '~/utils/file-config'
  import type { AIAnalysisResponse } from '~/types/analyze'

  const emit = defineEmits(['method-changed'])

  const selectedMethod = ref(0) // 0 for text, 1 for file
  const showHelpModal = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const { region, supportedRegions } = useGeolocation()

  const { locale } = useI18n()

  const dialectDisplay = computed(() => {
    const code = region.value?.countryCode
    const match = supportedRegions.value.find((r) => r.countryCode === code)
    return match?.dialectName?.[locale.value] || code
  })

  // Form data
  const textInput = ref('')
  const selectedFile = ref<File | null>(null)

  const selectMethod = (method: number) => {
    selectedMethod.value = method
    emit('method-changed', method)
    clearError()
  }

  // default method
  onMounted(() => {
    emit('method-changed', selectedMethod.value)
  })

  const clearError = () => {
    errorMessage.value = ''
  }

  const validateForm = (): boolean => {
    clearError()
    if (!region.value) {
      errorMessage.value = $t('analyze.validation.dialectRequired')
      return false
    }

    if (selectedMethod.value === 0) {
      // text input validation
      if (!textInput.value.trim()) {
        errorMessage.value = $t('analyze.validation.textRequired')
        return false
      }

      // at least one line with content
      const lines = textInput.value
        .trim()
        .split('\n')
        .filter((line) => line.trim())
      if (lines.length === 0) {
        errorMessage.value = $t('analyze.validation.oneCommentRequired')
        return false
      }
    } else {
      // file input validation
      if (!selectedFile.value) {
        errorMessage.value = $t('analyze.validation.fileRequired')
        return false
      }

      // check file size (config limit)
      if (selectedFile.value.size > MAX_FILE_SIZE_BYTES) {
        errorMessage.value = $t('analyze.errors.fileSizeExceeded', {
          size: bytesToMB(MAX_FILE_SIZE_BYTES),
        })
        return false
      }
      // check type
      if (!ACCEPTED_MIME_TYPES.includes(selectedFile.value.type)) {
        errorMessage.value = $t('analyze.errors.invalidFileType')
        return false
      }
    }

    return true
  }

  interface AnalysisResponse {
    success: boolean
    data: AIAnalysisResponse
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    isLoading.value = true
    clearError()

    try {
      const localePath = useLocalePath()
      const { setAnalysisResults } = useAnalysisResults()

      if (selectedMethod.value === 0) {
        // submit text input
        const response = await $fetch<AnalysisResponse>(
          '/api/analyze/comment',
          {
            method: 'POST',
            body: {
              text: textInput.value,
              region: region.value?.countryCode,
            },
          }
        )

        if (response.success) {
          // Store results in state and go to results page
          setAnalysisResults(response.data)
          await navigateTo(localePath('/analyze/results'))
        }
      } else {
        // submit file input
        const formData = new FormData()
        formData.append('file', selectedFile.value!)
        if (region.value) formData.append('region', region.value.countryCode)

        const response = await $fetch<AnalysisResponse>('/api/analyze/file', {
          method: 'POST',
          body: formData,
        })

        if (response.success) {
          // Store results in state and go to results page
          setAnalysisResults(response.data)
          await navigateTo(localePath('/analyze/results'))
        }
      }
    } catch (error: unknown) {
      console.error('Submission error:', error)

      type NuxtErrorShape = {
        data?: { message?: string; params?: Record<string, string | number> }
        message?: string
      }
      const e = (error as NuxtErrorShape).data as NuxtErrorShape
      const key = e?.data?.message || e?.message
      const params = e?.data?.params

      if (key && key.startsWith('analyze.')) {
        errorMessage.value = $t(key, params || {})
      } else if (key) {
        errorMessage.value = key
      } else {
        errorMessage.value = $t('analyze.validation.processingError')
      }
    } finally {
      isLoading.value = false
    }
  }

  const onFileError = (errorData: { message: string; file?: File }) => {
    errorMessage.value = errorData.message
  }
</script>

<style lang="postcss" scoped>
  .selected-method-style {
    @apply ms-[3px] scale-105 !rounded-t-md border border-b-0 border-colors-primary-light !bg-white font-medium;
  }
</style>
