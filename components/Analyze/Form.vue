<template>
  <form class="w-full lg:max-w-3xl mx-auto" @submit.prevent="handleSubmit">
    <!-- Form header -->
    <div class="flex justify-start">
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 0}"
        @click="selectMethod(0)"
      >
        {{ $t('analyze.form.textInput') }}
      </ui-button>
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 1}"
        @click="selectMethod(1)"
      >
        {{ $t('analyze.form.fileUpload') }}
      </ui-button>
    </div>
    <div
      class="flex flex-col gap-2 border border-colors-primary-light rounded-md p-4 lg:px-8 bg-white"
      :class="{'ltr:rounded-tl-none rtl:rounded-tr-none': selectedMethod === 0 }">
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
              :placeholder="$t('analyze.form.textPlaceholder')"
              :required="true"
            />
          </div>
          <div v-else>
            <ui-file-input
              key="file-input"
              :placeholder="$t('analyze.form.filePlaceholder')"
              @error="(message) => onFileError(message)"
              @update:file="(file) => selectedFile = file.data"
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
          <Icon
            name="mdi:arrow-right"
            size="24"
            class="rtl:rotate-180"
          />
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
const emit = defineEmits(['method-changed'])

const selectedMethod = ref(0) // 0 for text, 1 for file
const showHelpModal = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

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
  
  if (selectedMethod.value === 0) {
    // text input validation
    if (!textInput.value.trim()) {
      errorMessage.value = 'Text input is required'
      return false
    }
    
    // at least one line with content
    const lines = textInput.value.trim().split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      errorMessage.value = 'Please enter at least one comment' // TODO: i18n
      return false
    }
  } else {
    // file input validation
    if (!selectedFile.value) {
      errorMessage.value = 'Please select a file to upload'
      return false
    }
    
    // check file size (10MB limit)
    // TODO: define size in configs or a unified place
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (selectedFile.value.size > maxSize) {
      errorMessage.value = 'File size exceeds 10MB limit' // TODO: i18n
      return false
    }
  }
  
  return true
}

// TODO: define types in ~/types
interface AnalysisResponse {
  success: boolean
  data: unknown
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  clearError()
  
  try {
    const localePath = useLocalePath()
    if (selectedMethod.value === 0) {
      // submit text input
      const response = await $fetch<AnalysisResponse>('/api/analyze/comment', {
        method: 'POST',
        body: {
          text: textInput.value
        }
      })
      
      if (response.success) {
        // go to results with data
        await navigateTo({
          path: localePath('/analyze/results'),
          query: { data: JSON.stringify(response.data) }
        })
      }
    } else {
      // submit file input
      const formData = new FormData()
      formData.append('file', selectedFile.value!)
      
      const response = await $fetch<AnalysisResponse>('/api/analyze/file', {
        method: 'POST',
        body: formData
      })
      
      if (response.success) {
        await navigateTo({
          path: localePath('/analyze/results'),
          query: { data: JSON.stringify(response.data) }
        })
      }
    }
  } catch (error: unknown) {
    console.error('Submission error:', error)
    
    // Handle API errors
    // TODO: i18n for error messages
    if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      errorMessage.value = String(error.data.message)
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage.value = String(error.message)
    } else {
      errorMessage.value = 'An error occurred while processing your request'
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
  @apply border border-b-0 border-colors-primary-light !rounded-t-md !bg-white scale-105 ms-[3px];
}
</style>
