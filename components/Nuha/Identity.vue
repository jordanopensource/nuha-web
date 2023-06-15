<template>
  <div>
    <h2 class="text-nuha-fushia lg:w-full mb-12">
      {
      <span class="italic">
        {{ t('nuha.title') }}
      </span>
      }
    </h2>
    <p class="text-2xl font-light">
      {{ t('nuha.body') }}
    </p>
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss"></style>
