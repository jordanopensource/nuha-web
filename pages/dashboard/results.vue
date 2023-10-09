<template>
  <div class="container">
    <ClientOnly>
      <DashboardResult
        :prediction-data="resultsData.predictionData"
        :is-single-comment="resultsData.isSingleComment"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  definePageMeta({ auth: true, callbackUrl: '/login' })

  const router = useRouter()
  const localePath = useLocalePath()

  const resultsData = ref<{
    isSingleComment: boolean
    predictionData: {
      chartData: PredictionMetrics
      originalData: Array<PredictionResponse>
    }
  }>(useResultsData().resultsData().value)

  onMounted(() => {
    if (
      !resultsData.value.predictionData ||
      !resultsData.value.predictionData.chartData ||
      !resultsData.value.predictionData.originalData
    ) {
      router.push(localePath('/dashboard'))
    }
    useResultsData().resetResutsData()
  })
</script>

<style scoped lang="postcss"></style>
