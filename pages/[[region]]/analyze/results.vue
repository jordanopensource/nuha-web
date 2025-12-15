<!-- DEV: WIP -->
<template>
  <div class="page-container">
    <UiPageHeading :title="$t('analyze.results.title')" use-h1>
      <template v-if="totalValidComments > 0" #second-col>
        <div class="flex flex-wrap">
          <div
            class="flex flex-col gap-2 max-md:mx-auto max-md:mt-4 md:ms-auto print:hidden"
          >
            <UiButton class="ms-auto w-52" @click="showDownloadModal = true">
              {{ $t('analyze.results.actions.download') }}
              <template #icon>
                <Icon name="mdi:download" />
              </template>
            </UiButton>
            <UiButton
              class="ms-auto w-52"
              variant="outline"
              @click="handlePrint"
            >
              {{ $t('analyze.results.actions.print') }}
              <template #icon>
                <Icon name="mdi:printer" />
              </template>
            </UiButton>
            <UiButton
              class="ms-auto w-52 md:!hidden"
              variant="ghost"
              to="#results-overview"
            >
              {{ $t('analyze.results.actions.jumpToResults') }}
              <template #icon>
                <Icon name="mdi:arrow-down" />
              </template>
            </UiButton>
          </div>
        </div>
      </template>
    </UiPageHeading>

    <div v-if="analysisData && hasValidComments">
      <!-- Single Comment Analysis - Single Card Layout -->
      <div v-if="isSingleComment" class="mx-auto max-w-2xl">
        <div
          class="mb-6 break-inside-avoid rounded-lg border border-colors-neutral-placeholder border-opacity-20 bg-white p-6"
        >
          <h2 class="mb-6 font-normal">
            {{ $t('analyze.results.singleResult.title') }}
          </h2>

          <!-- Single Comment Result Card -->
          <div v-if="validComments && validComments[0]" class="space-y-6">
            <!-- Comment Text -->
            <div class="rounded-lg bg-gray-50 p-4">
              <h3 class="mb-2 text-base font-medium text-gray-700">
                {{ $t('analyze.results.details.headers.comment') }}
              </h3>
              <p class="text-xl">{{ validComments[0].originalComment }}</p>
            </div>

            <!-- Classification Result -->
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-lg bg-blue-50 p-4">
                <h3 class="mb-2 text-base font-medium text-blue-700">
                  {{ $t('analyze.results.singleResult.classification') }}
                </h3>
                <div class="space-y-1">
                  <p class="text-xl font-semibold text-blue-900">
                    {{ validComments[0].main_class }}
                  </p>
                  <p
                    v-if="
                      validComments[0].sub_class !== validComments[0].main_class
                    "
                    class="text-base text-blue-600"
                  >
                    {{ validComments[0].sub_class }}
                  </p>
                </div>
              </div>

              <div class="rounded-lg bg-green-50 p-4">
                <h3 class="mb-2 text-base font-medium text-green-700">
                  {{ $t('analyze.results.singleResult.confidence') }}
                </h3>
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <div class="h-3 flex-1 rounded-full bg-gray-200">
                      <div
                        class="h-3 rounded-full transition-all duration-300"
                        :class="
                          validComments[0].confidence > 0.8
                            ? 'bg-green-500'
                            : validComments[0].confidence > 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        "
                        :style="{
                          width: `${validComments[0].confidence * 100}%`,
                        }"
                      />
                    </div>
                    <span class="text-xl font-semibold text-green-900"
                      >{{
                        (validComments[0].confidence * 100).toFixed(1)
                      }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata (if available) -->
            <div
              v-if="validComments[0].platform || validComments[0].date"
              class="grid gap-4 md:grid-cols-2"
            >
              <div
                v-if="validComments[0].platform"
                class="rounded-lg bg-purple-50 p-4"
              >
                <h3 class="mb-2 text-sm font-medium text-purple-700">
                  {{ $t('analyze.results.details.headers.platform') }}
                </h3>
                <p class="text-purple-900">{{ validComments[0].platform }}</p>
              </div>

              <div
                v-if="validComments[0].date"
                class="rounded-lg bg-orange-50 p-4"
              >
                <h3 class="mb-2 text-sm font-medium text-orange-700">
                  {{ $t('analyze.results.details.headers.date') }}
                </h3>
                <p class="text-orange-900">{{ validComments[0].date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Analysis - Charts and Tables Layout -->
      <div v-else-if="isBulkAnalysis">
        <div
          class="mb-6 rounded-lg border border-colors-neutral-placeholder border-opacity-20 bg-white p-6"
          :class="{ 'print:hidden': noChartVisible }"
        >
          <UiPageHeading
            id="results-overview"
            :title="$t('analyze.results.overview')"
            class="!my-0 [&_h2]:font-normal"
          >
            <template #second-col>
              <UiButton
                variant="ghost"
                class="w-52 max-md:mx-auto md:ms-auto print:!hidden"
                @click="showCustomize = true"
              >
                {{ $t('analyze.results.customizeCharts') }}
                <template #icon>
                  <Icon name="mdi:pencil" />
                </template>
              </UiButton>
            </template>
          </UiPageHeading>

          <!-- Charts -->
          <ClientOnly>
            <div
              ref="chartsContainer"
              class="grid grid-cols-1 gap-6 py-12 max-sm:py-6 md:grid-cols-2 print:!grid-cols-1 print:py-6"
            >
              <div v-if="noChartVisible">
                {{ $t('analyze.results.noChartSelected') }}
              </div>
              <!-- Show only Distribution and Platform (if available) by default; others controlled via modal -->
              <ChartDoughnut
                v-if="chartsVisible.distribution"
                :key="`doughnut-${chartRerenderKey}`"
                class="m-auto w-3/4 break-inside-avoid max-sm:!w-full print:!w-full"
                :chart-data="pieChartData"
                :options="doughnutOptions"
                :style="
                  chartsContainer?.offsetWidth
                    ? `width: ${(chartsContainer.offsetWidth / 2) * 0.75}px`
                    : ''
                "
              />

              <ChartBar
                v-if="chartsVisible.platform"
                :key="`platform-${chartRerenderKey}`"
                class="m-auto w-full break-inside-avoid max-sm:!w-full print:!w-full print:min-w-52"
                :chart-data="platformStackedData"
                :options="platformsBarOptions"
                :style="
                  chartsContainer?.offsetWidth
                    ? `width: ${chartsContainer.offsetWidth / 2}px`
                    : ''
                "
              />

              <ChartBar
                v-if="chartsVisible.totals"
                :key="`totals-${chartRerenderKey}`"
                class="m-auto w-full break-inside-avoid max-sm:!w-full print:!w-full print:min-w-52"
                :chart-data="barChartData"
                :options="barOptions"
                :style="
                  chartsContainer?.offsetWidth
                    ? `width: ${chartsContainer.offsetWidth / 2}px`
                    : ''
                "
              />

              <ChartBar
                v-if="chartsVisible.histogram"
                :key="`histogram-${chartRerenderKey}`"
                class="m-auto w-full break-inside-avoid max-sm:!w-full print:!w-full print:min-w-52"
                :chart-data="histogramData"
                :options="histogramOptions"
                :style="
                  chartsContainer?.offsetWidth
                    ? `width: ${chartsContainer.offsetWidth / 2}px`
                    : ''
                "
              />
            </div>
          </ClientOnly>

          <!-- Customize Charts Modal -->
          <UiModal
            v-model="showCustomize"
            :title="$t('analyze.results.customizeCharts')"
            size="md"
            :cancel-button-text="$t('misc.close')"
            :show-action-button="false"
            @close="showCustomize = false"
          >
            <div class="space-y-4">
              <label class="checkbox-label">
                <input v-model="chartsVisible.distribution" type="checkbox" />
                <span>{{ $t('analyze.results.charts.distribution') }}</span>
              </label>
              <label class="checkbox-label">
                <input v-model="chartsVisible.totals" type="checkbox" />
                <span>{{ $t('analyze.results.charts.totals') }}</span>
              </label>
              <label
                class="checkbox-label"
                :class="{ 'pointer-events-none opacity-50': !hasPlatforms }"
                :title="
                  !hasPlatforms ? $t('analyze.results.noChartSelected') : ''
                "
              >
                <input
                  v-model="chartsVisible.platform"
                  type="checkbox"
                  :disabled="!hasPlatforms"
                />
                <span>{{ $t('analyze.results.charts.platformStacked') }}</span>
              </label>
              <label class="checkbox-label">
                <input v-model="chartsVisible.histogram" type="checkbox" />
                <span>{{ $t('analyze.results.charts.histogram') }}</span>
              </label>
            </div>
          </UiModal>
        </div>

        <!-- General Analysis Summary -->
        <div
          class="mb-6 break-inside-avoid rounded-lg border border-colors-neutral-placeholder border-opacity-20 bg-white p-6"
        >
          <h2 class="mb-4 font-normal">
            {{ $t('analyze.results.summary.title') }}
          </h2>

          <!-- TODO: replace tailwind dynamic classes with plain css -->
          <div
            class="mb-6 grid gap-4"
            :class="`grid-cols-${Math.min(mainClasses.length, 3)} max-sm:grid-cols-1`"
          >
            <ResultAnalysisSummaryChip
              v-for="(classData, index) in mainClasses"
              :key="classData.name"
              :class="getClassChipStyles(index)"
              :title="classData.name"
              :value="classData.percentage + '%'"
              :number-of-comments="classData.count"
              :confidence="(classData.avgConfidence * 100).toFixed(1)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-4 print:justify-center">
            <small class="flex items-center gap-1">
              <Icon
                name="mdi:info-outline"
                class="text-base text-colors-neutral-placeholder"
              />
              <strong>{{ $t('analyze.results.summary.totalLabel') }}</strong>
              {{ totalValidComments }}
              {{ $t('analyze.results.summary.commentsWord') }}
            </small>
            <small>
              <strong>{{ $t('analyze.results.summary.dialect') }}</strong>
              {{ dialectDisplay }}
            </small>
          </div>
        </div>

        <!-- Comments Details -->
        <div
          class="break-inside-avoid rounded-lg border border-colors-neutral-placeholder border-opacity-20 bg-white p-6"
        >
          <h2 class="mb-4 font-normal">
            {{ $t('analyze.results.details.title') }}
          </h2>

          <pv-DataTable
            v-model:filters="filters"
            :value="paginatedComments"
            :rows="rowsPerPage"
            :total-records="totalComments"
            :lazy="true"
            :paginator="true"
            :rows-per-page-options="[5, 10, 20, 50]"
            :loading="loading"
            :global-filter-fields="[
              'originalComment',
              'platform',
              'date',
              'main_class',
            ]"
            filter-display="menu"
            column-resize-mode="fit"
            resizable-columns
            paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :current-page-report-template="
              $t('analyze.results.details.pagination.showing', {
                first: '{first}',
                last: '{last}',
                total: '{totalRecords}',
              })
            "
            class="rounded-md px-4 py-8"
            @page="onPage"
            @sort="onSort"
            @filter="onFilter"
          >
            <template #empty>
              <div class="py-8 text-center text-gray-500">
                {{ $t('analyze.results.details.pagination.noData') }}
              </div>
            </template>
            <template #paginatorend>
              <UiButton
                variant="ghost"
                size="md"
                :title="$t('analyze.results.details.actions.showAllColumns')"
                class="aspect-square !rounded-full !p-2"
                style="color: var(--p-paginator-nav-button-color)"
                @click="restoreCols()"
              >
                <Icon name="mdi:restore" size="24" />
              </UiButton>
            </template>

            <template #loading>
              <div
                class="rounded-md bg-colors-neutral-background p-12 text-center"
              >
                <Icon
                  name="mdi:loading"
                  class="animate-spin text-2xl text-colors-primary"
                />
                <p class="mt-2 text-colors-neutral-placeholder">
                  {{ $t('misc.loading') }}
                </p>
              </div>
            </template>

            <pv-Column
              field="originalComment"
              :header="$t('analyze.results.details.headers.comment')"
              :sortable="true"
            >
              <template #body="{ data }">
                <div class="max-w-fit">
                  <div class="truncate" :title="data.originalComment">
                    {{ data.originalComment }}
                  </div>
                </div>
              </template>
            </pv-Column>

            <pv-Column
              v-if="hasPlatforms || columnsConfig.platform"
              field="platform"
              :header="$t('analyze.results.details.headers.platform')"
              :sortable="true"
            >
              <template #body="{ data }">
                {{ data.platform || $t('analyze.results.details.na') }}
              </template>
              <template #header>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :title="$t('analyze.results.details.actions.hideColumn')"
                  class="aspect-square !rounded-full !p-2 print:hidden"
                  @click="columnsConfig.platform = false"
                >
                  <Icon name="mdi:close" size="18" />
                </UiButton>
              </template>
            </pv-Column>

            <pv-Column
              v-if="columnsConfig.date"
              field="date"
              :header="$t('analyze.results.details.headers.date')"
              :sortable="true"
            >
              <template #body="{ data }">
                {{ data.date || $t('analyze.results.details.na') }}
              </template>
              <template #header>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :title="$t('analyze.results.details.actions.hideColumn')"
                  class="aspect-square !rounded-full !p-2 print:hidden"
                  @click="columnsConfig.date = false"
                >
                  <Icon name="mdi:close" size="18" />
                </UiButton>
              </template>
            </pv-Column>

            <pv-Column
              v-if="columnsConfig.label"
              field="label"
              :header="$t('analyze.results.details.headers.classification')"
              :sortable="true"
            >
              <template #body="{ data }">
                <div class="flex flex-col gap-1">
                  <span class="font-medium">{{ data.main_class }}</span>
                  <span
                    v-if="data.sub_class !== data.main_class"
                    class="pt-1 text-sm text-gray-500"
                  >
                    {{ data.sub_class }}
                  </span>
                </div>
              </template>
              <template #header>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :title="$t('analyze.results.details.actions.hideColumn')"
                  class="aspect-square !rounded-full !p-2 print:hidden"
                  @click="columnsConfig.label = false"
                >
                  <Icon name="mdi:close" size="18" />
                </UiButton>
              </template>
            </pv-Column>

            <pv-Column
              v-if="columnsConfig.score"
              field="score"
              :header="$t('analyze.results.details.headers.score')"
              :sortable="true"
            >
              <template #body="{ data }">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-16 rounded-full bg-gray-200">
                      <!-- TODO: unify colors -->
                      <div
                        class="h-2 rounded-full"
                        :class="
                          data.confidence > 0.8
                            ? 'bg-green-500'
                            : data.confidence > 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        "
                        :style="{ width: `${data.confidence * 100}%` }"
                      />
                    </div>
                    <span class="text-sm"
                      >{{ (data.confidence * 100).toFixed(1) }}%</span
                    >
                  </div>
                  <small
                    v-if="!data.is_valid"
                    class="font-medium text-gray-500"
                  >
                    {{ $t('analyze.results.details.validity.invalid') }}
                  </small>
                </div>
              </template>
              <template #header>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :title="$t('analyze.results.details.actions.hideColumn')"
                  class="aspect-square !rounded-full !p-2 print:hidden"
                  @click="columnsConfig.score = false"
                >
                  <Icon name="mdi:close" size="18" />
                </UiButton>
              </template>
            </pv-Column>
          </pv-DataTable>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="mt-8">
      <ui-message
        type="error"
        :message="error"
        show-close-button
        class="[&_.msg]:text-lg"
        @close="error = ''"
      />
    </div>

    <div
      v-else-if="!analysisData && !analysisLoading"
      class="mx-auto mt-8 text-center"
    >
      <p class="text-gray-600">{{ $t('analyze.results.noDataAvailable') }}</p>
    </div>
    <div v-else-if="analysisLoading" class="mx-auto mt-8 text-center">
      <Icon name="mdi:loading" class="loader !h-6 !w-6" />
    </div>

    <!-- download results bar -->
    <div
      v-if="totalValidComments > 0 && isBulkAnalysis"
      class="flex flex-wrap justify-center gap-2 print:hidden"
    >
      <UiButton class="w-52" @click="showDownloadModal = true">
        {{ $t('analyze.results.actions.download') }}
        <template #icon>
          <Icon name="mdi:download" />
        </template>
      </UiButton>
      <UiButton class="w-52" variant="outline" @click="handlePrint">
        {{ $t('analyze.results.actions.print') }}
        <template #icon>
          <Icon name="mdi:printer" />
        </template>
      </UiButton>
    </div>
    <!-- Back to analyze button -->
    <UiButton
      class="mx-auto mt-4 w-fit flex-row-reverse print:!hidden"
      size="lg"
      :to="$localePath('/analyze')"
      @click="clearAnalysisResults"
    >
      {{ $t('analyze.results.backToAnalyze') }}
      <template #icon>
        <Icon name="mdi:arrow-left" size="24" class="rtl:rotate-180" />
      </template>
    </UiButton>

    <!-- Download Modal -->
    <AnalyzeDownloadModal
      v-model="showDownloadModal"
      :analysis-data="analysisData"
      :on-print-p-d-f="handlePrint"
      @close="showDownloadModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { ChartData, ChartOptions } from 'chart.js'
  import type { AIAnalysisResponse, SingleResult } from '~/types/analyze'
  import { analysisColors } from '~/utils/colors'
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import { useWindowSize } from '@vueuse/core'

  const { supportedRegions, region } = useGeolocation()
  const { locale, locales, t } = useI18n()
  const { width } = useWindowSize()

  definePageMeta({
    middleware: ['auth'],
  })

  useHead({
    title: () => `${$t('analyze.results.title')} — ${$t('homepage.nuha')}`,
  })

  const { getAnalysisResults, clearAnalysisResults } = useAnalysisResults()
  const analysisData = ref<AIAnalysisResponse | null>(null)
  const validComments = ref<SingleResult[]>()
  const analysisLoading = ref({})
  const error = ref('')
  const isRtl = computed(
    () => locales.value.find((l) => l.code === locale.value)?.dir === 'rtl'
  )
  const chartsContainer = ref<HTMLDivElement>()

  // to control what table columns to show
  const columnsConfig = reactive({
    platform: false,
    date: false,
    label: true,
    score: true,
  })
  const restoreCols = () => {
    columnsConfig.platform = true
    columnsConfig.date = true
    columnsConfig.label = true
    columnsConfig.score = true
  }

  // Chart re-rendering key to force updates
  const chartRerenderKey = ref(0)
  const forceChartRerender = () => {
    chartRerenderKey.value++
  }

  // watch for window resize to re-render charts
  watch(
    width,
    () => {
      forceChartRerender()
    },
    { immediate: false }
  )

  onMounted(() => {
    window.addEventListener('beforeprint', forceChartRerender)

    // Get analysis data from state instead of URL query parameters
    const storedData = getAnalysisResults()
    if (storedData) {
      analysisData.value = storedData
      validComments.value = analysisData.value.results.filter((r) => r.is_valid)
      analysisLoading.value = false
    } else {
      error.value = $t('analyze.results.noDataAvailable')
      analysisLoading.value = false
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeprint', forceChartRerender)
  })

  const handlePrint = () => {
    // make sure modal is closed
    showDownloadModal.value = false

    // give time for modal to fully close and page to re-render
    nextTick(() => {
      setTimeout(() => {
        document.body.focus()
        window.print()
      }, 300)
    })
  }

  // charts visibility state + modal toggle
  const showCustomize = ref(false)
  const showDownloadModal = ref(false)
  const chartsVisible = reactive({
    distribution: true, // doughnut chart
    totals: false, // totals horizontal bar
    platform: true, // stacked by platform
    histogram: false, // score histogram
  })

  // checks if no chart is selected to be visible
  const noChartVisible = computed(
    () =>
      !(
        chartsVisible.distribution ||
        chartsVisible.totals ||
        chartsVisible.platform ||
        chartsVisible.histogram
      )
  )

  const dialectDisplay = computed(() => {
    const code = region.value?.countryCode
    const match = supportedRegions.value.find((r) => r.countryCode === code)
    return match?.dialectName?.[locale.value] || code
  })

  const totalComments = computed(() => analysisData.value?.results?.length ?? 0)
  const totalValidComments = computed(() => validComments.value?.length ?? 0)

  // early exit if no valid comments: don't compute charts or other expensive operations
  const hasValidComments = computed(() => totalValidComments.value > 0)
  const isSingleComment = computed(() => totalComments.value === 1)
  const isBulkAnalysis = computed(() => totalComments.value > 1)

  // no valid comments error message
  watchEffect(() => {
    if (analysisData.value && !hasValidComments.value) {
      error.value = $t('analyze.results.noValidComments', {
        dialect: dialectDisplay.value,
      })
    }
  })

  // Compute main classes from results (only for bulk analysis)
  const mainClasses = computed(() => {
    if (!isBulkAnalysis.value || !validComments.value) return []

    const classMap = new Map<
      string,
      { count: number; totalConfidence: number }
    >()

    validComments.value.forEach((result) => {
      const className = result.main_class
      if (!classMap.has(className)) {
        classMap.set(className, { count: 0, totalConfidence: 0 })
      }

      const existing = classMap.get(className)!
      existing.count++
      existing.totalConfidence += result.confidence
    })

    return Array.from(classMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      percentage: Math.round((data.count / totalValidComments.value) * 100),
      avgConfidence: data.totalConfidence / data.count,
    }))
  })

  // Generate colors for main classes
  // TODO refactor
  const getClassChipStyles = (index: number) => {
    const colors = [
      'bg-colors-analysis-hate-100 border-colors-analysis-hate-200 text-colors-analysis-hate-600',
      'bg-colors-analysis-nonhate-100 border-colors-analysis-nonhate-200 text-colors-analysis-nonhate-600',
      'bg-colors-analysis-neutral-100 border-colors-analysis-neutral-200 text-colors-analysis-neutral-600',
      'bg-blue-100 border-blue-200 text-blue-600',
      'bg-green-100 border-green-200 text-green-600',
      'bg-purple-100 border-purple-200 text-purple-600',
    ]
    return colors[index % colors.length]
  }

  // Datasets and options (only computed for bulk analysis)
  const barChartData = computed<ChartData<'bar'>>(() => {
    if (!isBulkAnalysis.value || !hasValidComments.value)
      return { labels: [], datasets: [] }

    const datasets = mainClasses.value.map((classData, index) => ({
      label: classData.name,
      data: [classData.count],
      backgroundColor: getChartColor(index),
      barThickness: 64,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0000',
    }))

    return {
      labels: [t('analyze.results.charts.commentsAxis')],
      datasets,
    }
  })

  const pieChartData = computed<ChartData<'doughnut'>>(() => {
    if (!isBulkAnalysis.value) return { labels: [], datasets: [] }

    return {
      labels: mainClasses.value.map((c) => c.name),
      datasets: [
        {
          data: mainClasses.value.map((c) => c.count),
          backgroundColor: mainClasses.value.map((_, index) =>
            getChartColor(index)
          ),
          label: t('analyze.results.charts.commentsCountLabel'),
        },
      ],
    }
  })

  // get chart colors dynamically
  // TODO: refactor
  const getChartColor = (index: number) => {
    const colors = [
      analysisColors.hate,
      analysisColors.nonhate,
      analysisColors.neutral,
      '#3B82F6',
      '#10B981',
      '#8B5CF6',
    ]
    return colors[index % colors.length]
  }

  const barOptions = reactive<ChartOptions<'bar'>>({
    responsive: false,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: t('analyze.results.charts.titles.totals'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
      legend: {
        align: 'center',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        rtl: isRtl.value,
      },
      tooltip: {
        rtl: isRtl.value,
        titleFont: {
          family: 'IBM Plex Sans Arabic',
        },
        bodyFont: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  const doughnutOptions = reactive<ChartOptions<'doughnut'>>({
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: t('analyze.results.charts.titles.distribution'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
      legend: {
        align: 'center',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        rtl: isRtl.value,
      },
      tooltip: {
        rtl: isRtl.value,
        titleFont: {
          family: 'IBM Plex Sans Arabic',
        },
        bodyFont: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  // Stacked bar: labels per platform
  const platforms = computed(() => {
    if (!hasValidComments.value) return []

    const set = new Set<string>()
    for (const result of validComments.value ?? []) {
      set.add(result.platform || 'Unknown')
    }
    return Array.from(set)
  })

  const platformStackedData = computed<ChartData<'bar'>>(() => {
    if (!hasValidComments.value) return { labels: [], datasets: [] }

    const classNames = mainClasses.value.map((c) => c.name)
    const base = Object.fromEntries(
      platforms.value.map((p) => [
        p,
        Object.fromEntries(classNames.map((c) => [c, 0])),
      ])
    )

    for (const result of validComments.value ?? []) {
      const p = result.platform || 'Unknown'
      const className = result.main_class
      if (base[p] && base[p][className] !== undefined) {
        base[p][className]++
      }
    }

    const labels = platforms.value
    return {
      labels,
      datasets: classNames.map((className, index) => ({
        label: className,
        data: labels.map((l) => base[l][className] || 0),
        backgroundColor: getChartColor(index),
      })),
    }
  })
  const platformsBarOptions = reactive<ChartOptions<'bar'>>({
    responsive: false,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: t('analyze.results.charts.titles.platformStacked'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
      legend: {
        align: 'center',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        rtl: isRtl.value,
      },
      tooltip: {
        rtl: isRtl.value,
        titleFont: {
          family: 'IBM Plex Sans Arabic',
        },
        bodyFont: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  const histogramData = computed<ChartData<'bar'>>(() => {
    if (!isBulkAnalysis.value || !hasValidComments.value)
      return { labels: [], datasets: [] }

    const bins = Array.from({ length: 10 }, (_, i) => i / 10)
    const labels = bins.map(
      (b) => `${(b * 100).toFixed(0)}–${((b + 0.1) * 100).toFixed(0)}%`
    )

    // Initialize counts for each main class
    const classCounts = Object.fromEntries(
      mainClasses.value.map((c) => [c.name, Array(10).fill(0)])
    )

    for (const result of validComments.value ?? []) {
      const idx = Math.min(9, Math.floor(result.confidence * 10))
      const className = result.main_class
      if (classCounts[className]) {
        classCounts[className][idx]++
      }
    }

    return {
      labels,
      datasets: mainClasses.value.map((classData, index) => ({
        label: classData.name,
        data: classCounts[classData.name],
        backgroundColor: getChartColor(index),
      })),
    }
  })
  const histogramOptions = reactive<ChartOptions<'bar'>>({
    responsive: false,
    maintainAspectRatio: true,
    indexAxis: 'x',
    plugins: {
      title: {
        display: true,
        text: t('analyze.results.charts.titles.histogram'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
      legend: {
        align: 'center',
        labels: {
          font: {
            family: 'IBM Plex Sans Arabic',
          },
        },
        rtl: isRtl.value,
      },
      tooltip: {
        rtl: isRtl.value,
        titleFont: {
          family: 'IBM Plex Sans Arabic',
        },
        bodyFont: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  // whether there are platforms available
  const hasPlatforms = computed(() => {
    if (!hasValidComments.value) return false
    return platforms.value.filter((p) => p !== 'Unknown').length > 0
  })
  watch(
    hasPlatforms,
    (hasValidPlatforms) => {
      if (!hasValidPlatforms) {
        chartsVisible.platform = false
        chartsVisible.histogram = true // since platforms charts is now disabled, show this chart instead
        columnsConfig.platform = false
      } else {
        chartsVisible.platform = true
        chartsVisible.histogram = false
        columnsConfig.platform = true
      }
    },
    { immediate: true }
  )

  // DataTable state and functionality
  const filters = ref({})
  // const showFilters = ref(false)
  const loading = ref(false)
  const first = ref(0)
  const rowsPerPage = ref(10)

  const initFilters = () => {
    filters.value = {
      // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      originalComment: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      platform: {
        // operator: FilterOperator.AND,
        constraints: [
          { value: FilterMatchMode.EQUALS, matchMode: FilterMatchMode.EQUALS },
        ],
      },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      main_class: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      // balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      // status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      // activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
      // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    }
  }
  onMounted(() => {
    initFilters()
  })

  // Paginated data for server-side simulation
  const paginatedComments = ref<Array<SingleResult>>([])

  // DEV: Server-side pagination simulation
  // TODO: REMOVE
  const fetchData = (
    page: number,
    rows: number,
    sortField?: string,
    sortOrder?: number,
    filters?: Record<string, { value: string }>
  ) => {
    loading.value = true

    // Simulate server delay
    // TODO: replace with actual server pagination
    setTimeout(() => {
      let data = [...(analysisData.value?.results ?? [])]

      // Apply filters
      if (filters) {
        Object.keys(filters).forEach((key) => {
          const filter = filters[key]
          if (filter && filter.value && filter.value.key !== '') {
            data = data.filter((item) => {
              const value = item[key as keyof typeof item]
              if (typeof value === 'string') {
                return value
                  .toLowerCase()
                  .includes(filter.value.key.toLowerCase())
              }
              return String(value)
                .toLowerCase()
                .includes(filter.value.key.toLowerCase())
            })
          }
        })
      }

      // Apply sorting
      if (sortField) {
        data.sort((a, b) => {
          const aVal = a[sortField as keyof typeof a]
          const bVal = b[sortField as keyof typeof b]

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 1
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
          }

          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder === 1 ? aVal - bVal : bVal - aVal
          }

          return 0
        })
      }

      // Apply pagination
      const start = page * rows
      const end = start + rows
      paginatedComments.value = data.slice(start, end)

      loading.value = false
    }, 300)
  }

  // Event handlers
  const onPage = (event: {
    first: number
    rows: number
    page: number
    sortField?: string
    sortOrder?: number
  }) => {
    first.value = event.first
    rowsPerPage.value = event.rows
    fetchData(
      event.page,
      event.rows,
      event.sortField,
      event.sortOrder,
      filters.value
    )
  }
  const onSort = (event: { sortField: string; sortOrder: number }) => {
    fetchData(
      first.value / rowsPerPage.value,
      rowsPerPage.value,
      event.sortField,
      event.sortOrder,
      filters.value
    )
  }
  const onFilter = (event: { filters: Record<string, unknown> }) => {
    filters.value = event.filters
    fetchData(0, rowsPerPage.value, undefined, undefined, event.filters)
  }

  // Initialize data when analysisData changes
  watch(
    analysisData,
    () => {
      if (analysisData.value) {
        fetchData(0, rowsPerPage.value)
      }
    },
    { immediate: true }
  )
</script>
<style scoped lang="postcss">
  input[type='checkbox'] {
    @apply scale-125 accent-colors-primary;
  }
  .checkbox-label {
    @apply flex items-center gap-2 rounded-md p-2;
    @apply transition-colors duration-200 hover:bg-colors-primary-light;
  }
</style>
<style lang="postcss">
  .p-datatable {
    .p-datatable-mask {
      @apply rounded-md bg-colors-neutral-placeholder bg-opacity-50;
    }
    .p-datatable-tbody > tr {
      @apply border-b border-colors-neutral-placeholder;
      &:hover {
        @apply bg-colors-analysis-neutral-50;
      }
    }
  }
  .p-select {
    @apply !shadow-none hover:!border-colors-primary-active focus:!border-colors-primary-active active:!border-colors-primary-active;
  }
  .p-select-option.p-select-option-selected {
    @apply !bg-colors-analysis-neutral-500 !text-colors-neutral-background hover:!bg-colors-analysis-neutral-600;
  }
  .p-paginator,
  .p-datatable-paginator-bottom {
    @apply print:!hidden;
  }
  .p-paginator-content-end {
    @apply !mx-0;
  }
</style>
