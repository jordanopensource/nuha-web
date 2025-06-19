<template>
  <div class="mb-20 p-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 mb-20 gap-10">
      <h2 class="text-4xl">{{ t('predictionResult.title') }}</h2>
      <div v-if="!isSingleComment" class="font-IBMPlexSansArabic text-lg flex flex-col gap-4">
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
        <UiButton
          @click="downloadResults"
          variant="outline"
          class="w-fit"
        >
          {{ t('data.downloadResults') }}
          <template #icon>
            <IconDownload class="[&_path]:fill-current"/>
          </template>
        </UiButton>
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
        class="w-full grid grid-cols-2 max-lg:grid-cols-1 gap-10 justify-center items-center mb-20"
      >
        <ChartsPie
          :data="chartData"
          :size="width > 768 ? 300 : 150"
          :max-width="150"
          show-legend
        >
          <template #caption>
            <p class="mt-2 font-IBMPlexSansArabic text-sm">
              <span class="font-bold">{{ $t('methodology.figure') }} 1:</span>
              {{ $t('predictionResult.charts.1') }}
            </p>
          </template>
        </ChartsPie>
        <ChartsBar
          :data="chartData"
          :max-height="300"
          :max-width="150"
          show-legend
        >
          <template #caption>
            <p class="mt-2 font-IBMPlexSansArabic text-sm">
              <span class="font-bold">{{ $t('methodology.figure') }} 2:</span>
              {{ $t('predictionResult.charts.2') }}
            </p>
          </template>
        </ChartsBar>
      </div>

      <div class="block w-full my-10">
        <div class="flex justify-between items-center py-5">
          <h2>{{ t('predictionResult.details') }}:</h2>
        </div>
        <el-table
          :data="commentData"
          style="width: 100%"
          class-name="table-container"
        >
          <el-table-column
            prop="comment"
            :label="t('data.text')"
            class-name="comment-text"
          />
          <el-table-column
            sortable
            prop="label"
            :label="t('data.type')"
            width="180"
            v-slot="colProp"
          >
            <div class="flex items-center gap-4 font-IBMPlexSansArabic text-base">
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
            :label="t('data.score')"
            width="200"
            class-name="f1score"
            v-slot="colProp"
          >
            <div class="flex flex-wrap gap-2 items-center font-IBMPlexSansArabic text-base">
              {{ (colProp?.row?.score / 100).toFixed(2) }}
              <div class="bg-nuha-fushia-200 flex-1 h-5">
                <div
                  class="h-full bg-nuha-fushia-secondary"
                  :style="`width: ${colProp?.row?.score?.toFixed(0)}%;`"
                ></div>
              </div>
            </div>
          </el-table-column>
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
  import { get, useWindowSize } from '@vueuse/core'
  const { t } = useI18n()
  const { width } = useWindowSize()

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

  const chartData = computed(() => [
    {
      key: t('data.hateSpeech'),
      value: props.predictionData?.chartData.hateSpeechPercentage,
      color: '#d13561',
    },
    {
      key: t('data.neutral'),
      value: props.predictionData?.chartData.nonHateSpeechPercentage,
      color: '#6db981',
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

  /* Results Table Styling */
  table {
    @apply max-sm:inline !bg-white text-xl;
  }
  tr {
    @apply max-sm:border-b-2 border-nuha-grey-200 border-dashed border-opacity-50;
    td {
      @apply !border-0 !border-nuha-grey-100;
      @apply !border-dotted !border-b max-sm:border-opacity-50;

      &:last-child {
        @apply max-sm:!border-0;
      }
    }
  }
  .comment-text .cell {
    direction: rtl;
    text-align: right;
  }
  table.el-table__header {
    @apply max-sm:hidden;
    @apply border-t-2 border-nuha-grey-100;
    thead {
      th {
        @apply !py-4;
        @apply !border-0 !border-b-2 !border-dotted !border-nuha-grey border-opacity-70;
      }
    }
  }
  .el-table .cell {
    @apply break-normal;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background li {
    @apply font-IBMPlexSansArabic !text-sm;
  }
</style>
