<script setup lang="ts"></script>

<template>
  <div class="main">
    <HeroIntroText />
    <div class="flex-grow">
      <HeroWaitlist />
      <div class="lg:hidden">
        <NuxtLink to="#learn-more" class="link">
          {{ $t('link.learnMore') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .main {
    @apply h-5/6 grid grid-cols-1 place-items-center lg:flex lg:items-center lg:justify-between lg:gap-x-10;
  }
  .link {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
</style>
