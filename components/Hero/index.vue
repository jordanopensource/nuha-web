<template>
  <main>
    <section class="hero-grid !grid-cols-2 max-lg:!grid-cols-1">
      <div class="w-full flex flex-col gap-y-12">
        <h1 class="text-nuha-grey leading-none">
          {{ $t('homeHero.title') }}
        </h1>
        <p class="text-nuha-grey leading-none text-4xl lg:w-4/5">
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
