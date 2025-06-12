<template>
  <div class="container">
    <div class="mt-10">
      <UiButton
        :to="localePath('/dashboard')"
        variant="ghost"
        class="w-fit flex-row-reverse me-auto"
      >
        {{ t('dashboard.actions.goBack') }}
        <template #icon>
          <IconArrowForward class="ltr:rotate-180"/>
        </template>
      </UiButton>
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
