<template>
  <div class="mt-10">
    <h4 class="italic pb-5">{{ t('predictionResult.title') }}:</h4>
    <div v-if="!isSingleComment">
      <div class="block lg:flex justify-between items-center">
        <div class="w-full">
          <div class="hidden lg:block">
            <UiPieChart :width="500" :chart-data="chartData" />
          </div>
          <div class="block lg:hidden">
            <UiPieChart :width="300" :chart-data="chartData" />
          </div>
          <p class="text-center w-full text-xl font-medium italic">
            {{ t('predictionResult.percentage') }}
          </p>
        </div>

        <div class="w-full">
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
          <p class="text-center w-full text-xl font-medium italic">
            {{ t('predictionResult.count') }}
          </p>
        </div>
      </div>

      <div class="block w-full my-10">
        <h5 class="italic pb-5">{{ t('predictionResult.details') }}:</h5>
        <el-table :data="commentData" stripe style="width: 100%">
          <el-table-column prop="comment" :label="t('data.comment')" />
          <el-table-column prop="label" :label="t('data.type')" width="180" />
          <el-table-column
            prop="score"
            :label="t('data.f1Score')"
            width="180"
          />
        </el-table>

        <div v-if="numPages > 1" class="w-full flex justify-center my-3">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="numPages * 10"
            @update:current-page="
              (p) => {
                currentPage = p - 1
              }
            "
          />
        </div>
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
  import { get } from '@vueuse/core'
  const { t } = useI18n()

  const props = defineProps({
    predictionData: Object as {
      chartData: PredictionMetrics
      originalData: Array<PredictionResponse>
    },
    isSingleComment: Boolean,
  })

  const chartData = computed(() => [
    {
      key: t('data.hateSpeech'),
      value: props.predictionData.chartData.hateSpeechPercentage,
    },
    {
      key: t('data.neutral'),
      value: props.predictionData.chartData.nonHateSpeechPercentage,
    },
  ])

  const itemsPerPage = 20
  const currentPage = ref(0)
  const numPages = computed(() =>
    Math.ceil(props.predictionData.originalData.length / itemsPerPage)
  )
  const commentData = computed(() =>
    props.predictionData.originalData
      .flat()
      .splice(get(currentPage) * itemsPerPage, itemsPerPage)
  )
</script>

<style lang="postcss">
  .el-pagination.is-background .el-pager li.is-active {
    @apply !bg-nuha-fushia-300;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background li {
    @apply hover:text-nuha-fushia-300 !bg-white;
  }
</style>
