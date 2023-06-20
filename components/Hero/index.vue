<script setup lang="ts"></script>

<template>
  <div class="main">
    <HeroIntroText v-if="!hideSection" />
    <div class="flex-grow">
      <HeroWaitlist @hide-intro="(value) => (hideSection = value)" />
      <div class="lg:hidden">
        <a href="#learn-more" class="link" v-if="!hideSection">
          {{ $t('link.learnMore') }}
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { set } from '@vueuse/core'
  const hideSection = ref(false)
</script>
<style lang="postcss" scoped>
  .main {
    @apply h-5/6 grid grid-cols-1 place-items-center lg:flex lg:items-center lg:justify-between lg:gap-x-14;
  }
  .link {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
</style>
