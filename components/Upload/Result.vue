<template>
  <div class="mt-10">
    <h4>{{ t('predictionResult.title') }}:</h4>
    <div v-if="!isSingleComment">
      <div class="block lg:flex justify-center items-center">
        <UiPieChart
          :chart-data="[
            {
              key: t('data.hateSpeech'),
              value: predictionData.chartData.hateSpeechPercentage,
            },
            {
              key: t('data.neutral'),
              value: predictionData.chartData.nonHateSpeechPercentage,
            },
          ]"
        />
        <UiBarChart
          :chart-data="[
            {
              name: t('data.hateSpeech'),
              count: predictionData.chartData.hateSpeechCount,
            },
            {
              name: t('data.neutral'),
              count: predictionData.chartData.nonHateSpeechCount,
            },
          ]"
        />
      </div>

      <div class="block">
        <el-table
          :data="predictionData.originalData"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="comment" :label="t('data.comment')" />
          <el-table-column prop="label" :label="t('data.type')" width="180" />
          <el-table-column
            prop="score"
            :label="t('data.f1Score')"
            width="180"
          />
        </el-table>
      </div>
    </div>
    <div v-else>
      <div class="bg-white mt-5 p-5 rounded-xl border-nuha-grey-200 border">
        {{
          t('predictionResult.commentTypeMsg') +
          ' ' +
          predictionData.originalData[0].label
        }}.
      </div>
      <div class="bg-white mt-5 p-5 rounded-xl border-nuha-grey-200 border">
        {{
          t('predictionResult.f1ScoreMsg').replace(
            '%s',
            predictionData.originalData[0].score.toString()
          )
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()

  const props = defineProps({
    predictionData: Object as {
      chartData: PredictionMetrics
      originalData: Array<PredictionResponse>
    },
    isSingleComment: Boolean,
  })
</script>
