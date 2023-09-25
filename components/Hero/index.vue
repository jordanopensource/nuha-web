<template>
  <div class="main">
    <div class="w-full">
      <div class="w-3/4">
        <h1 class="text text-6xl lg:text-8xl">
          {{ $t('homeHero.title') }}
        </h1>
        <h2 class="text my-5 text-3xl lg:text-4xl">
          {{ $t('homeHero.intro') }}
        </h2>
        <a :href="localePath('/dashboard')">
          <button class="btn">
            {{ $t('homeHero.tryItOut') }}
            <IconArrowRight class="mx-2 rtl:hidden ltr:inline-block" />
            <IconArrowLeft class="mx-2 ltr:hidden rtl:inline-block" />
          </button>
        </a>
      </div>
    </div>
    <div class="w-full">
      <NuxtImg class="nuha-logo" src="/hero-logo.svg" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
</script>

<style lang="postcss" scoped>
  .main {
    @apply h-5/6 grid grid-cols-1 place-items-center lg:flex lg:items-center lg:justify-between lg:gap-x-14;
  }
  .link {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
  .text {
    @apply text-nuha-grey leading-snug font-IBMPlexSansArabic;
  }
  .btn {
    @apply border my-3 p-3 flex items-center justify-center text-2xl;
    @apply border-nuha-fushia-300;
    @apply bg-nuha-fushia-300 text-white;
    @apply hover:bg-nuha-fushia-100 hover:text-nuha-fushia-300;
  }
  .nuha-logo {
    @apply my-10 lg:my-0;
    @apply w-full;
    @apply md:w-[512px];
    @apply lg:w-[707px];
  }
</style>
