<template>
  <div class="mb-20">
    <div class="grid grid-cols-1 lg:grid-cols-2 mt-10 mb-20 gap-y-10">
      <h2 class="text-4xl">{{ t('predictionResult.title') }}</h2>
      <div v-if="!isSingleComment">
        <p>
          {{ t('predictionResult.fileName') }}
          <span class="text-nuha-fushia">
            {{ fileName }}
          </span>
        </p>
        <p>
          {{ t('predictionResult.importedRows') }}
          <span class="font-bold">
            {{ importedRows }}
          </span>
        </p>
        <button @click="downloadResults" class="btn">
          {{ t('data.downloadResults') }}
          <div class="arrow-icon rotate-90"></div>
        </button>
      </div>
      <div v-else>
        <p class="text-xl">
          {{ t('predictionResult.originalComment') }}
          <span class="font-bold">
            {{ comment }}
          </span>
        </p>
      </div>
    </div>
    <div v-if="!isSingleComment">
      <div
        class="w-full grid grid-cols-2 max-lg:grid-cols-1 gap-20 justify-center items-center mb-20"
      >
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
        </div>
        <el-table :data="commentData" stripe style="width: 100%">
          <el-table-column prop="comment" :label="t('data.comment')" />
          <el-table-column
            sortable
            prop="label"
            :label="t('data.type')"
            width="180"
            v-slot="colProp"
          >
            <div class="flex items-center gap-4 flex-wrap">
              <div
                class="w-5 aspect-square h-5"
                :class="colProp?.row?.label === $t('data.neutral') ? 'bg-prediction-neutral' : 'bg-prediction-hatespeach'"
              ></div>
              {{ colProp?.row?.label }}
            </div>
          </el-table-column>
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
      <div class="bg-white mt-5 p-5 border-nuha-grey-200 border">
        {{
          t('predictionResult.commentTypeMsg') +
          ' ' +
          predictionData?.originalData[0]?.label
        }}.
      </div>
      <div class="bg-white mt-5 p-5 border-nuha-grey-200 border">
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
    comment: String,
    isSingleComment: Boolean,
    importedRows: Number,
    fileName: String,
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
      `"${t('data.comment')}","${t('data.type')}","${t('data.f1Score')}"\n` +
      props.predictionData?.originalData
        .map((result) => {
          return `"${result.comment}","${result.label}","${result.score}"`
        })
        .join('\n')

    const download = document.createElement('a')
    const blob = new Blob(['\ufeff', resultCSV])
    download.href = URL.createObjectURL(blob)
    download.download = `Prediction results - ${new Date().toString()}.csv`
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
    @apply w-5 h-5 transform text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
