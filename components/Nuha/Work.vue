<template>
  <div>
    <h2 class="text-nuha-fushia lg:w-full my-12 pt-12">
      {
      <span class="italic">
        {{ t('nuha.work.title') }}
      </span>
      }
    </h2>
    <p class="text-2xl font-light">
      {{ t('nuha.work.body') }}
    </p>
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss"></style>
