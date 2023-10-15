<template>
  <section class="h-full my-20">
    <div class="main">
      <div class="w-full p-4">
        <h1 class="text">
          {{ $t('homeHero.title') }}
        </h1>
        <p class="text my-6 mb-12 text-4xl lg:w-2/3">
          {{ $t('homeHero.intro') }}
        </p>

        <NuxtLink
          class="btn"
          :to="localePath('/dashboard')"
        >
          {{ $t('homeHero.tryItOut') }}
          <span class="rtl:rotate-180 mt-1">￫</span>
        </NuxtLink>
      </div>
      <div class="w-full">
        <NuxtImg class="nuha-logo" src="/hero-logo.svg" alt="Nuha logo"/>
      </div>
    </div>

    <HeroMethodology />
  </section>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
</script>

<style lang="postcss" scoped>
  .main {
    @apply grid grid-cols-1 lg:grid-cols-2 place-items-center lg:gap-x-14 items-start;
  }
  .text {
    @apply text-nuha-grey leading-none;
  }
  .btn {
    @apply text-base w-32 h-10 border px-6 py-3;
    @apply flex items-center justify-center gap-1;
    @apply border-nuha-fushia-300 bg-nuha-fushia-100 text-nuha-fushia-300;
    @apply hover:bg-nuha-fushia-300 hover:text-white;
  }
  .nuha-logo {
    @apply my-10 lg:my-0;
    @apply w-full;
    @apply w-full lg:w-[707px];
  }
</style>
