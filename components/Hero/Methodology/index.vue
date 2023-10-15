<template>
  <section class="flex flex-col gap-y-16 max-sm:gap-y-12">
    <div class="main">
      <h2 class="w-full">
        {{ t('methodology.title') }}
      </h2>
      <p class="text-2xl leading-none">
        {{ t('methodology.description') }}
      </p>
    </div>

    <div class="cards">
      <HeroMethodologyCard
        v-for="(meth, i) in methodologies"
        :key="i"
        :title="meth.title()"
        :subtitle="meth.subtitle()"
        :content="meth.description()"
        :image="meth.image"
        :read-more-link="meth.readMoreLink"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  const { t } = useI18n()

  const methodologies: {
    title(): string
    subtitle(): string
    description(): string
    image: string
    readMoreLink: string
  }[] = [
    {
      title: () => t('methodology.aboutProject'),
      subtitle: () => t('methodology.aboutProjectSubtitle'),
      description: () => t('methodology.aboutProjectDescription'),
      image: '/images/nuha-meth-1.svg',
      readMoreLink: '/methodology#about',
    },
    {
      title: () => t('methodology.detailed'),
      subtitle: () => t('methodology.detailedSubtitle'),
      description: () => t('methodology.detailedDescription'),
      image: '/images/nuha-meth-2.svg',
      readMoreLink: '/methodology#details',
    },
    {
      title: () => t('methodology.ethical'),
      subtitle: () => t('methodology.ethical'),
      description: () => t('methodology.ethicalDescription'),
      image: '/images/nuha-meth-3.svg',
      readMoreLink: '/methodology#ethics',
    },
  ]
</script>

<style lang="postcss" scoped>
  .cards {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-between;
  }
</style>
