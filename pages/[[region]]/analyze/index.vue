<template>
  <div class="page-container">
    <UiPageHeading
      :title="$t('analyze.page.title')"
      use-h1
      :subtitle="$t('analyze.page.subtitle')"
    />
    <div class="my-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      <analyze-form @method-changed="handleMethodChanged" />
      <div class="hidden pt-10 md:block">
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
    middleware: 'auth',
  })

  useHead({
    title: () => `${$t('analyze.page.title')} — ${$t('homepage.nuha')}`,
  })

  const currentMethod = ref(0) // 0 for text, 1 for file

  const handleMethodChanged = (method: number) => {
    currentMethod.value = method
  }
</script>
