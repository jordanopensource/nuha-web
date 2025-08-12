<!-- TODO: i18n -->
 <!-- TODO: make buttons smaller on small screens -->
<template>
  <form class="max-w-3xl mx-auto" @submit.prevent>
    <div class="flex lg:px-4 justify-center lg:justify-start">
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 0}"
        @click="selectedMethod = 0"
      >
        Text Input
      </ui-button>
      <ui-button
        variant="ghost"
        class="!rounded-none !rounded-t-md"
        :class="{'selected-method-style': selectedMethod === 1}"
        @click="selectedMethod = 1"
      >
        File Upload
      </ui-button>
    </div>
    <div class="flex flex-col gap-2 border border-colors-primary-light rounded-md p-4 lg:px-8 bg-white">
       <div class="flex justify-between py-2">
          <ui-region-language-selector
            mode="region"
            title="Region for the AI Model Dialect"
          />
          <ui-button
            variant="ghost"
            aria-label="help"
            title="help"
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
          modal-label="Text Input"
          placeholder="Add text"
          :required="true"
        />
        <ui-file-input
          v-else
          placeholder="Upload or Drop File"
          @error="(message) => onFileError(message)"
        />
      </div>
      <ui-button
        size="lg"
        class="mx-auto mt-4"
        type="submit"
      >
        Analyze
        <template #icon>
          <Icon
            name="mdi:arrow-right"
            size="24"
          />
        </template>
      </ui-button>
    </div>
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
