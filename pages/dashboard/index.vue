<template>
  <section class="container">
    <DashboardHero />
    <div class="separator"></div>
    <DashboardUpload />
  </section>
</template>

<script setup lang="ts">
  definePageMeta({ auth: true, callbackUrl: '/login' })
</script>

<style scoped lang="postcss">
  .separator {
    @apply h-0 border-2 border-b-nuha-fushia-300 mb-3;
  }
</style>
