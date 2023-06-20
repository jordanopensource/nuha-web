<template>
  <div>
    <UiAppHeader class="lg:hidden mb-10 snap-start shrink-0" />
    <div class="container mb-32">
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
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss"></style>
