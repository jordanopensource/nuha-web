<template>
  <form class="w-full lg:max-w-3xl mx-auto" @submit.prevent>
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
            mode="region"
            :title="$t('analyze.form.regionTitle')"
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

const selectMethod = (method: number) => {
  selectedMethod.value = method
  emit('method-changed', method)
}

// default method
onMounted(() => {
  emit('method-changed', selectedMethod.value)
})

// TODO: error handling and error messages
const onFileError = (msg: string) => {
  console.error("Error: ", msg)
}
</script>
<style scoped lang="postcss">
.selected-method-style {
  @apply border border-b-0 border-colors-primary-light !rounded-t-md !bg-white scale-105 ms-[3px];
}
</style>
