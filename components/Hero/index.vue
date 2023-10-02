<template>
  <section class="h-full my-20">
    <div class="main">
      <div class="w-full">
        <div class="w-3/4">
          <h1 class="text text-6xl lg:text-8xl">
            {{ $t('homeHero.title') }}
          </h1>
          <p class="text my-5 text-3xl lg:text-4xl">
            {{ $t('homeHero.intro') }}
          </p>
          <a :href="localePath('/dashboard')">
            <button class="btn">
              {{ $t('homeHero.tryItOut') }}
              <div class="arrow-icon"></div>
            </button>
          </a>
        </div>
      </div>
      <div class="w-full">
        <NuxtImg class="nuha-logo" src="/hero-logo.svg" />
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
    @apply grid grid-cols-1 lg:grid-cols-2 place-items-center lg:gap-x-14;
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
    @apply bg-nuha-fushia-100 text-nuha-fushia-300;
    @apply hover:bg-nuha-fushia-300 hover:text-white;
  }
  .nuha-logo {
    @apply my-10 lg:my-0;
    @apply w-full;
    @apply md:w-[512px];
    @apply lg:w-[707px];
  }
  .btn:hover .arrow-icon {
    @apply bg-[url('/icons/arrow-right-white.svg')];
  }
  .arrow-icon {
    @apply mx-2 w-8 h-8 transform rtl:rotate-180 text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
