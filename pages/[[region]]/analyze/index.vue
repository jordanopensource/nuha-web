<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('analyze.page.title')"
      use-h1
      :subtitle="$t('analyze.page.subtitle')" 
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-5">
      <analyze-form @method-changed="handleMethodChanged" />
      <div class="hidden md:block p-4 lg:px-8">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="mdi:help-circle-outline" class="text-colors-primary" size="24" />
          <h2 class="text-lg font-IBMPlexSansArabic">{{ $t('analyze.help.title') }}</h2>
        </div>
        <analyze-text-input-help v-if="currentMethod === 0" />
        <analyze-file-upload-help v-else />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const currentMethod = ref(0) // 0 for text, 1 for file

const handleMethodChanged = (method: number) => {
  currentMethod.value = method
}
</script>
