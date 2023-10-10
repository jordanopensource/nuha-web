<template>
  <div class="container">
    <div class="mt-10">
      <button
        @click="
          () => {
            router.push(localePath('/dashboard'))
          }
        "
        class="btn"
      >
        <div class="arrow-icon"></div>
        {{ t('dashboard.actions.goBack') }}
      </button>
    </div>

    <ClientOnly>
      <DashboardResult
        :prediction-data="resultsData.predictionData"
        :is-single-comment="resultsData.isSingleComment"
        :imported-rows="resultsData.importedRows"
        :file-name="resultsData.fileName"
        :comment="resultsData.originalComment"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  definePageMeta({ auth: true, callbackUrl: '/login' })

  const router = useRouter()
  const localePath = useLocalePath()
  const { t } = useI18n()

  const resultsData = ref<{
    isSingleComment: boolean
    predictionData: {
      chartData: PredictionMetrics
      originalData: Array<PredictionResponse>
    }
    originalComment: string
    importedRows: number
    fileName: string
  }>(useResultsData().resultsData().value)

  onMounted(() => {
    if (
      !resultsData.value.predictionData ||
      !resultsData.value.predictionData.chartData ||
      !resultsData.value.predictionData.originalData
    ) {
      router.push(localePath('/dashboard'))
    }
    console.log('res', resultsData)
    useResultsData().resetResutsData()
  })
</script>

<style scoped lang="postcss">
  .btn {
    @apply border my-3 p-1 flex items-center justify-center text-lg;
    @apply border-nuha-fushia-300;
    @apply bg-nuha-fushia-100 text-nuha-fushia-300;
    @apply hover:bg-nuha-fushia-300 hover:text-white;
  }
  .btn:hover .arrow-icon {
    @apply bg-[url('/icons/arrow-right-white.svg')];
  }
  .arrow-icon {
    @apply transform rotate-180 rtl:rotate-0;
    @apply w-5 h-5 text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
