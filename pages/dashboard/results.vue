<template>
  <div class="container">
    <div class="mt-10">
      <NuxtLink
        :to="localePath('/dashboard')"
        class="btn"
      >
        <span class="me-1 rotate-180 rtl:rotate-0">￫</span>
        {{ t('dashboard.actions.goBack') }}
      </NuxtLink>
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
    @apply border px-3 py-1 text-lg max-w-max max-h-9 h-9;
    @apply border-nuha-fushia-300;
    @apply bg-nuha-white text-nuha-fushia-300;
    @apply hover:bg-nuha-fushia-300 hover:text-nuha-white;
  }
</style>
