<template>
  <div class="main container my-24 flex flex-col gap-y-10">
    <FindingsHero />
    <ContentDoc />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ auth: false })
</script>

<style lang="postcss" scoped>
  .main {
    .findings-border {
      @apply border-b-2 border-[#a066a9] pb-16;
    }
  }
</style>
