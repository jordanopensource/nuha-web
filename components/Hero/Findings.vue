<template>
  <section class="flex flex-col gap-y-16 max-sm:gap-y-12">
    <div v-if="showHeading" class="main">
      <h2 class="w-full">
        {{ t('findings.title') }}
      </h2>
      <div class="flex flex-col gap-y-8">
        <p class="text-2xl leading-none">
          {{ t('findings.description') }}
        </p>
        <NuxtLink
          v-if="showLinktoAll"
          class="text-nuha-grey-300 flex items-center gap-x-1 hover:underline"
          :to="$nuxt.$localePath('/findings')"
        >
          {{ $t('findings.seeAll') }} <span class="arrow-icon"></span>
        </NuxtLink>
      </div>
    </div>

    <div class="cards">
      <!-- TODO: show only the first 3 findings -->
      <template v-for="(finding, i) in data">
        <HeroCard
          v-if="finding._path?.replace('/ar', '') !== '/findings'"
          :key="i"
          :title="finding.title"
          :subtitle="finding.subtitle"
          :content="finding.description"
          :image="finding.thumbnail"
          :category="finding.category"
          :read-more-link="finding._path"
          class="finding-card"
        />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
  const { t, locale } = useI18n()
  // fetch findings
  const { data } = await useAsyncData(() => {
    return locale.value === 'en'
      ? queryContent('/findings').find()
      : queryContent('/ar/findings').find()
  })
  defineProps({
    showHeading: {
      type: Boolean,
      default: true,
    },
    showLinktoAll: {
      type: Boolean,
      default: true,
    },
  })
</script>

<style lang="postcss" scoped>
  .cards {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-between;
  }
  .arrow-icon {
    @apply inline-block w-5 h-5 rtl:rotate-180;
    @apply bg-[url('/icons/arrow-right-grey.svg')] bg-cover bg-no-repeat;
  }
</style>
<style>
  .finding-card .subtitle {
    width: 100%;
  }
</style>
