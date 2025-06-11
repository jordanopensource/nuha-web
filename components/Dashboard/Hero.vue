<template>
  <div class="hero-grid">
    <h1>{{ t('dashboard.title') }}</h1>
    <p class="text-4xl col-span-2 max-lg:text-3xl lg:px-8">
      {{ t('dashboard.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()
</script>
