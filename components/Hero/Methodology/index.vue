<template>
  <section class="border-nuha-fushia-300 border-t-2 mt-20">
    <div class="lg:flex lg:justify-between py-20">
      <div class="lg:w-1/2">
        <h4>
          {{ t('methodology.title') }}
        </h4>
      </div>
      <div class="lg:w-1/2">
        <p>
          {{ t('methodology.description') }}
        </p>
      </div>
    </div>

    <div class="cards">
      <HeroMethodologyCard
        v-for="(meth, i) in methodologies"
        :key="i"
        :title="meth.title()"
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
    description(): string
    image: string
    readMoreLink: string
  }[] = [
    {
      title: () => t('methodology.aboutProject'),
      description: () => t('methodology.aboutProjectDescription'),
      image: '/images/nuha-meth-1.svg',
      readMoreLink: '/',
    },
    {
      title: () => t('methodology.detailed'),
      description: () => t('methodology.detailedDescription'),
      image: '/images/nuha-meth-2.svg',
      readMoreLink: '/',
    },
    {
      title: () => t('methodology.ethical'),
      description: () => t('methodology.ethicalDescription'),
      image: '/images/nuha-meth-3.svg',
      readMoreLink: '/',
    },
  ]
</script>

<style lang="postcss" scoped>
  .cards {
    @apply grid grid-cols-1 lg:grid-cols-3;
    justify-content: space-evenly;
    justify-items: center;
  }
</style>
