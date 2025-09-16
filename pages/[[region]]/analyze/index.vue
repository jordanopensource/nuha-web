<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('analyze.page.title')"
      use-h1
      :subtitle="$t('analyze.page.subtitle')" 
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-5">
      <analyze-form @method-changed="handleMethodChanged" />
      <div class="hidden md:block p-2 lg:px-8">
        <div class="flex items-center gap-3 mb-4">
          <Icon name="mdi:help-circle-outline" class="text-colors-primary" size="24" />
          <h2 class="text-lg font-IBMPlexSansArabic">{{ $t('analyze.help.title') }}</h2>
        </div>
        <UiXTransition :direction-value="currentMethod">
          <div v-if="currentMethod === 0">
            <analyze-text-input-help />
          </div>
          <div v-else>
            <analyze-file-upload-help />
          </div>
        </UiXTransition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const currentMethod = ref(0) // 0 for text, 1 for file

const handleMethodChanged = (method: number) => {
  currentMethod.value = method
}
</script>
