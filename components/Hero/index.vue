<script setup lang="ts"></script>

<template>
  <div class="main">
    <HeroIntroText />
    <div>
      <HeroWaitlist />
      <div class="lg:hidden">
        <a href="#statistics" class="link">
          {{ $t('link.learnMore') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .main {
    @apply h-5/6 grid grid-cols-1 place-items-center lg:flex lg:items-center lg:justify-between;
  }
  .link {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
</style>
