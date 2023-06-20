<template>
  <div>
    <h2
      class="hidden lg:block font-semibold text-center text-nuha-grey my-8 font-IBMPlexSansArabic"
    >
      {
      <span class="italic">
        {{ t('link.statistics') }}
      </span>
      }
    </h2>
    <div
      class="bg-nuha-grey lg:container lg:rounded-[2.75rem] lg:drop-shadow-2xl"
    >
      <div class="container">
        <UiAppHeader class="lg:hidden mb-10 snap-start shrink-0" :logo-color="'white'" />
        <h2 class="lg:hidden font-semibold text-center text-nuha-fushia-100">
          {
          <span class="italic">
            {{ t('link.statistics') }}
          </span>
          }
        </h2>
        <div class="block lg:flex">
          <UiPieChart :chart-data="speechData" />
          <div class="container my-12">
            <p class="text-nuha-fushia-100 text-2xl font-light">
              {{ t('statistical.info') }}
            </p>
          </div>
        </div>
      </div>
      <NuhaIndicator />
    </div>
  </div>
</template>
<script setup lang="ts">
  const { t } = useI18n()
  const speechData: {
    key: string
    value: number
  }[] = [
    {
      key: t('data.hateSpeech'),
      value: 57,
    },
    {
      key: t('data.positiveSpeech'),
      value: 23,
    },
    {
      key: t('data.unrelated'),
      value: 15.99,
    },
    {
      key: t('data.neutral'),
      value: 4.01,
    },
  ]
</script>
