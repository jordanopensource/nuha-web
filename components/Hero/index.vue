<template>
  <main>
    <section class="main">
      <div class="w-full">
        <h1 class="text">
          {{ $t('homeHero.title') }}
        </h1>
        <p class="text my-6 mb-12 text-4xl lg:w-2/3">
          {{ $t('homeHero.intro') }}
        </p>

        <UiButton class="w-fit" size="lg" :to="localePath('/dashboard')">
          {{ $t('homeHero.tryItOut') }}
          <template #icon>
            <IconArrowForward class="rtl:rotate-180"/>
          </template>
        </UiButton>
      </div>
      <div class="w-full">
        <img class="nuha-logo" src="/hero-logo.svg" alt="Nuha logo" />
      </div>
    </section>

    <HeroMethodology />
    <!-- <HeroFindings /> -->
  </main>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
</script>

<style lang="postcss" scoped>
  .main {
    @apply grid grid-cols-1 lg:grid-cols-2 place-items-start lg:gap-x-14;
  }
  .link {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
  .text {
    @apply text-nuha-grey leading-none;
  }
  .nuha-logo {
    @apply my-10 lg:my-0;
    @apply w-full;
    @apply w-full lg:w-[707px];
  }
  .arrow-icon {
    @apply mx-2 w-8 h-8 transform rtl:rotate-180 text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
