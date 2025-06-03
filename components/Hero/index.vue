<template>
  <main>
    <section class="grid grid-cols-1 lg:grid-cols-2 place-items-start lg:gap-x-14">
      <div class="w-full">
        <h1 class="text-nuha-grey leading-none">
          {{ $t('homeHero.title') }}
        </h1>
        <p class="text-nuha-grey leading-none my-6 mb-12 text-4xl lg:w-2/3">
          {{ $t('homeHero.intro') }}
        </p>

        <UiButton
          class="w-fit"
          size="lg"
          :to="useAuthCheck() ? localePath('/dashboard') : localePath('/login')">
          {{ $t('homeHero.tryItOut') }}
          <template #icon>
            <IconArrowForward class="rtl:rotate-180"/>
          </template>
        </UiButton>
      </div>
      <div class="w-full">
        <SvgoHeroLogo class="w-full rounded-md my-10 lg:my-0"/>
      </div>
    </section>

    <HeroMethodology />
    <!-- <HeroFindings /> -->
  </main>
</template>

<script setup lang="ts">
  const localePath = useLocalePath()
</script>
