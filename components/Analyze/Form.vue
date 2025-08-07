<!-- TODO: i18n -->
 <!-- TODO: make buttons smaller on small screens -->
<template>
  <div>
    <div class="flex lg:px-4 justify-center lg:justify-start">
      <ui-button
        variant="ghost"
        class="!rounded-none border-b-colors-primary"
        :class="{'border-b-4': selectedMethod === 0}"
        @click="selectedMethod = 0"
      >
        Text Input
      </ui-button>
      <ui-button
        variant="ghost"
        class="!rounded-none border-b-colors-primary"
        :class="{'border-b-4': selectedMethod === 1}"
        @click="selectedMethod = 1"
      >
        File Upload
      </ui-button>
    </div>
    <div class="border border-colors-primary rounded-md p-4 lg:px-8 bg-white">
      <!-- TODO: add info / helper button for accepted types and formats info -->
      <!-- TODO: add region switcher -->
      <ui-text-area
        v-if="selectedMethod === 0"
        label="Text input"
        placeholder="Add text"
      />
      <ui-file-input
        v-else
        label="Upload file"
        placeholder="Upload or Drop File"
        @error="(message) => onFileError(message)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const selectedMethod = ref(0) // 0 for text, 1 for file


const onFileError = (msg: string) => {
  console.error("Error: ", msg)
}
</script>
<style scoped lang="postcss">
</style>
