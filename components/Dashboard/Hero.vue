<template>
  <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-5 my-5 lg:my-20">
    <h1>{{ t('dashboard.title') }}</h1>
    <p class="text-4xl">{{ t('dashboard.description') }}</p>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()
</script>

<style scoped lang="postcss"></style>
