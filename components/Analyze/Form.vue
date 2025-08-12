<template>
  <form class="w-full lg:max-w-3xl mx-auto" @submit.prevent>
    <div class="flex justify-center lg:justify-start">
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 0}"
        @click="selectedMethod = 0"
      >
        {{ $t('analyze.form.textInput') }}
      </ui-button>
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 1}"
        @click="selectedMethod = 1"
      >
        {{ $t('analyze.form.fileUpload') }}
      </ui-button>
    </div>
    <div
      class="flex flex-col gap-2 border border-colors-primary-light rounded-md p-4 lg:px-8 bg-white"
      :class="{'ltr:lg:rounded-tl-none rtl:lg:rounded-tr-none': selectedMethod === 0 }">
       <div class="flex justify-between py-2">
          <ui-region-language-selector
            mode="region"
            :title="$t('analyze.form.regionTitle')"
          />
          <ui-button
            variant="ghost"
            :aria-label="$t('analyze.form.help')"
            :title="$t('analyze.form.help')"
            class=""
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
      <div>
        <ui-text-area
          v-if="selectedMethod === 0"
          :modal-label="$t('analyze.form.textInput')"
          :placeholder="$t('analyze.form.textPlaceholder')"
          :required="true"
        />
        <ui-file-input
          v-else
          :placeholder="$t('analyze.form.filePlaceholder')"
          @error="(message) => onFileError(message)"
        />
      </div>
      <ui-button
        size="lg"
        class="mx-auto mt-4"
        type="submit"
      >
        {{ $t('links.general.analyze') }}
        <template #icon>
          <Icon
            name="mdi:arrow-right"
            size="24"
            class="rtl:rotate-180"
          />
        </template>
      </ui-button>
    </div>

    <!-- Help Modal -->
    <UiModal
      v-model="showHelpModal"
      :title="$t('analyze.help.title')"
      :show-action-button="false"
      :cancel-button-text="$t('misc.close')"
      :close-aria-label="$t('misc.close')"
      size="md"
      @cancel="showHelpModal = false"
    >
      <!-- Text Input Help -->
      <div v-if="selectedMethod === 0" class="space-y-4">
        <h3 class="text-lg font-IBMPlexSansArabic">{{ $t('analyze.help.textInput.title') }}</h3>
        <div class="space-y-3">
          <div>
            <h4 class="mb-2">{{ $t('analyze.help.textInput.structure') }}</h4>
            <div class="bg-colors-primary-light border bg-opacity-10 p-4 mx-2 mb-4 rounded-md text-sm">
              <p
              class="text-colors-neutral-foreground opacity-70 whitespace-pre-line font-IBMPlexMono"
              >
              {{ $t('analyze.help.textInput.sampleText') }}
            </p>
          </div>
          <p>{{ $t('analyze.help.textInput.structure-subtitle') }}</p>
          </div>
          <div>
            <h4 class="mb-2">{{ $t('analyze.help.textInput.tips') }}</h4>
            <ul class="space-y-1 list-disc list-inside text-colors-neutral-foreground opacity-80">
              <li>{{ $t('analyze.help.textInput.tip1') }}</li>
              <li>{{ $t('analyze.help.textInput.tip2') }}</li>
              <li>{{ $t('analyze.help.textInput.tip3') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- File Upload Help -->
      <div v-else class="space-y-4">
        <h3 class="text-lg font-medium font-IBMPlexSansArabic">{{ $t('analyze.help.fileUpload.title') }}</h3>
        <div class="space-y-3">
          <div>
            <h4 class="mb-2">{{ $t('analyze.help.fileUpload.supportedTypes') }}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10">
                <Icon name="mdi:file-document" size="24" class="text-colors-primary" />
                <div>
                  <div dir="ltr" class="font-medium rtl:text-end">.txt</div>
                  <div class="text-sm opacity-70">{{ $t('analyze.help.fileUpload.textFile') }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10">
                <Icon name="mdi:file-word" size="24" class="text-colors-primary" />
                <div>
                  <div dir="ltr" class="font-medium rtl:text-end">.docx</div>
                  <div class="text-sm opacity-70">{{ $t('analyze.help.fileUpload.wordFile') }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10">
                <Icon name="mdi:file-pdf-box" size="24" class="text-colors-primary" />
                <div>
                  <div dir="ltr" class="font-medium rtl:text-end">.pdf</div>
                  <div class="text-sm opacity-70">{{ $t('analyze.help.fileUpload.pdfFile') }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10">
                <Icon name="mdi:file-table" size="24" class="text-colors-primary" />
                <div>
                  <div dir="ltr" class="font-medium rtl:text-end">.csv</div>
                  <div class="text-sm opacity-70">{{ $t('analyze.help.fileUpload.csvFile') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="mb-2">{{ $t('analyze.help.fileUpload.requirements') }}</h4>
            <ul class="space-y-1 list-disc list-inside text-colors-neutral-foreground opacity-80">
              <li>{{ $t('analyze.help.fileUpload.maxSize') }}</li>
              <li>{{ $t('analyze.help.fileUpload.encoding') }}</li>
              <li>{{ $t('analyze.help.fileUpload.content') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </UiModal>
  </form>
</template>
<script setup lang="ts">
const selectedMethod = ref(0) // 0 for text, 1 for file

const showHelpModal = ref(false)

// TODO: error handling and error messages
const onFileError = (msg: string) => {
  console.error("Error: ", msg)
}
</script>
<style scoped lang="postcss">
.selected-method-style {
  @apply border border-colors-primary-light !border-b-4 border-b-colors-primary !bg-white;
}
</style>
