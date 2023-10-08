<template>
  <div class="mt-10">
    <h2 class="text-4xl my-28">{{ t('predictionResult.title') }}</h2>
    <div v-if="!isSingleComment">
      <div class="w-full grid grid-cols-2 max-lg:grid-cols-1 gap-20 justify-center items-center mb-20">
        <ChartsPie
          :data="chartData"
          :colors="['#6db981', '#d13561']"
          :size="300"
          show-legend
        >
          <template #caption>
            <p class="mt-2">
              <span class="font-bold">{{ $t('methodology.figure') }} 1:</span>
              {{ $t('predictionResult.charts.1') }}
            </p>
          </template>
        </ChartsPie>
        <ChartsBar
          :data="chartData"
          :colors="['#6db981', '#d13561']"
          :max-height="300"
          :max-width="150"
          show-legend
        >
          <template #caption>
            <p class="mt-2">
              <span class="font-bold">{{ $t('methodology.figure') }} 2:</span>
              {{ $t('predictionResult.charts.2') }}
            </p>
          </template>
        </ChartsBar>
      </div>

      <div class="block w-full my-10">
        <div class="flex justify-between items-center py-5">
          <h5 class="italic">{{ t('predictionResult.details') }}:</h5>
          <button
            class="rounded-xl bg-nuha-fushia-300 text-white text-lg p-3"
            @click="downloadResults"
            >{{ t('data.downloadResults') }}</button>
        </div>
        <el-table :data="commentData" stripe style="width: 100%">
          <el-table-column prop="comment" :label="t('data.comment')" />
          <el-table-column sortable prop="label" :label="t('data.type')" width="180" />
          <el-table-column
            sortable
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
              (p: number) => {
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
          predictionData?.originalData[0]?.label
        }}.
      </div>
      <div class="bg-white mt-5 p-5 rounded-xl border-nuha-grey-200 border">
        {{
          t('predictionResult.f1ScoreMsg').replace(
            '%s',
            (predictionData?.originalData[0]?.score ?? 0).toString(),
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
    predictionData: Object as PropType<{
      chartData: PredictionMetrics
      originalData: Array<PredictionResponse>
    }>,
    isSingleComment: Boolean,
  })

  const width = useClientWidth()

  const chartData = computed(() => [
    {
      key: t('data.hateSpeech'),
      value: props.predictionData?.chartData.hateSpeechPercentage,
    },
    {
      key: t('data.neutral'),
      value: props.predictionData?.chartData.nonHateSpeechPercentage,
    },
  ])

  const itemsPerPage = 20
  const currentPage = ref(0)
  const numPages = computed(() =>
    Math.ceil((props.predictionData?.originalData?.length ?? 1) / itemsPerPage),
  )
  const commentData = computed(
    () =>
      props.predictionData?.originalData
        .flat()
        .splice(get(currentPage) * itemsPerPage, itemsPerPage),
  )

  function downloadResults() {
    const resultCSV =
      `"${t("data.comment")}","${t("data.type")}","${t("data.f1Score")}"\n` +
      props.predictionData?.originalData
        .map((result) => {
          return `"${result.comment}"|"${result.label}"|"${result.score}"`
        })
        .join('\n')

    const download = document.createElement("a");
    const blob = new Blob(["\ufeff", resultCSV]);
    download.href = URL.createObjectURL(blob);
    download.download = `Prediction results - ${new Date().toString()}.csv`;
    download.click()
  }
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

  .cell {
    @apply rtl:!text-right;
  }

  button.btn-prev,
  button.btn-next {
    @apply rtl:!rotate-180;
  }
</style>
