<!-- DEV: WIP -->
<template>
  <div class="page-container">
    <UiPageHeading :title="$t('analyze.results.title')" use-h1>
      <template v-if="isValidJob" #second-col>
        <div class="flex flex-wrap">
          <div
            class="flex flex-col gap-2 max-md:mx-auto max-md:mt-4 md:ms-auto print:hidden"
          >
            <!-- Analysis processing status indicator -->
            <div
              v-if="isProcessing"
              class="ms-auto flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
            >
              <Icon name="mdi:loading" class="animate-spin" />
              {{ $t('misc.loading') }} ({{
                Math.round(
                  ((jobStatus?.processed_comments || 0) /
                    (jobStatus?.total_comments || 1)) *
                    100
                )
              }}%)
            </div>

            <UiButton
              class="ms-auto w-52"
              :disabled="isProcessing"
              @click="showDownloadModal = true"
            >
              {{ $t('analyze.results.actions.download') }}
              <template #icon>
                <Icon name="mdi:download" />
              </template>
            </UiButton>
            <UiButton
              class="ms-auto w-52"
              variant="outline"
              :disabled="isProcessing"
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

    <div v-if="isValidJob">
      <!-- Bulk Analysis - Charts and Tables Layout -->
      <!-- Only showing Bulk layout for now -->
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
          :class="`grid-cols-${Math.min(stats.mainClasses.length, 3)} max-sm:grid-cols-1`"
        >
          <ResultAnalysisSummaryChip
            v-for="(classData, index) in stats.mainClasses"
            :key="classData.name"
            :class="getClassChipStyles(index)"
            :title="classData.name"
            :value="
              Math.round((classData.count / (totalAnalyzed || 1)) * 100) + '%'
            "
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
            <!-- TODO: i18n -->
            <strong>{{ $t('analyze.results.summary.totalLabel') }}</strong>
            {{ jobStatus?.total_comments }} ({{ totalAnalyzed }} analyzed)
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
          id="dt-responsive-table"
          v-model:filters="filters"
          :value="paginatedComments"
          :rows="rowsPerPage"
          :total-records="totalAnalyzed"
          :lazy="true"
          :paginator="true"
          :always-show-paginator="false"
          :rows-per-page-options="rowsPerPageOptions"
          :loading="tableLoading"
          column-resize-mode="fit"
          resizable-columns
          table-style="table-layout: fixed"
          pt:columnResizeIndicator:class="bg-colors-primary-active"
          paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          :current-page-report-template="
            $t('analyze.results.details.pagination.showing', {
              first: '{first}',
              last: '{last}',
              total: '{totalRecords}',
            })
          "
          class="rounded-md py-8 md:px-4"
          @page="onPage"
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
              class="aspect-square !rounded-full !p-2 max-md:!hidden"
              style="color: var(--p-paginator-nav-button-color)"
              @click="restoreCols()"
            >
              <Icon name="mdi:view-column" size="24" />
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
            field="comment"
            :header="$t('analyze.results.details.headers.comment')"
            style="width: 50%"
          >
            <template #body="{ data }">
              <div class="flex items-start gap-2">
                <div
                  class="comment-cell flex-1 transition-all"
                  :class="data._expanded ? 'whitespace-normal' : 'truncate'"
                  :title="data.comment"
                >
                  {{ data.comment }}
                </div>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :title="
                    data._expanded
                      ? $t('analyze.results.details.actions.collapseComment')
                      : $t('analyze.results.details.actions.expandComment')
                  "
                  class="aspect-square shrink-0 !rounded-full !p-1 max-md:!hidden print:!hidden"
                  @click="data._expanded = !data._expanded"
                >
                  <Icon
                    name="mdi:chevron-down"
                    class="transition-transform"
                    :class="{ 'rotate-180': data._expanded }"
                    size="18"
                  />
                </UiButton>
              </div>
            </template>
          </pv-Column>

          <pv-Column
            v-if="columnsConfig.platform && hasPlatforms"
            field="platform"
            :header="$t('analyze.results.details.headers.platform')"
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
          >
            <template #body="{ data }">
              <div class="flex flex-col gap-1">
                <span class="overflow-hidden whitespace-normal font-medium">{{
                  data.main_class
                }}</span>
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
          >
            <template #body="{ data }">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 max-md:justify-center">
                  <div class="h-2 w-16 rounded-full bg-gray-200">
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

    <div v-else-if="error" class="mt-8">
      <ui-message
        type="error"
        :message="error"
        show-close-button
        class="[&_.msg]:text-lg"
        @close="error = ''"
      />
    </div>

    <div v-else-if="analysisLoading" class="mx-auto mt-8 text-center">
      <Icon name="mdi:loading" class="loader !h-6 !w-6" />
      <p class="mt-2 font-medium text-gray-400">{{ $t('misc.loading') }}</p>
    </div>

    <div v-else class="mx-auto mt-8 text-center">
      <p class="text-gray-600">{{ $t('analyze.results.noDataAvailable') }}</p>
    </div>

    <div
      v-if="isValidJob"
      class="flex flex-wrap justify-center gap-2 print:hidden"
    >
      <UiButton
        :disabled="isProcessing"
        class="w-52"
        @click="showDownloadModal = true"
      >
        {{ $t('analyze.results.actions.download') }}
        <template #icon>
          <Icon name="mdi:download" />
        </template>
      </UiButton>
      <UiButton
        :disabled="isProcessing"
        class="w-52"
        variant="outline"
        @click="handlePrint"
      >
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
    >
      {{ $t('analyze.results.backToAnalyze') }}
      <template #icon>
        <Icon name="mdi:arrow-left" size="24" class="rtl:rotate-180" />
      </template>
    </UiButton>

    <!-- Download Modal -->
    <AnalyzeDownloadModal
      v-if="isValidJob && jobId"
      v-model="showDownloadModal"
      :on-print-p-d-f="handlePrint"
      :job-id="jobId"
      @close="showDownloadModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { ChartData, ChartOptions } from 'chart.js'
  import type {
    SingleResult,
    AnalysisJob,
    AnalysisOverviewResponse,
    MainClassStats,
    PlatformStats,
    HistogramStats,
  } from '~/types/analyze'
  import { analysisColors } from '~/utils/colors'
  // import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
  import { useWindowSize } from '@vueuse/core'

  const { supportedRegions, region } = useGeolocation()
  const { locale, locales, t } = useI18n()
  const { width } = useWindowSize()
  const route = useRoute()

  definePageMeta({
    middleware: ['auth'],
  })

  useHead({
    title: () => `${$t('analyze.results.title')} — ${$t('homepage.nuha')}`,
  })

  const jobId = ref<string | null>(route.query.id as string)
  const jobStatus = ref<AnalysisJob | null>(null)
  const stats = ref({
    mainClasses: [] as Array<MainClassStats>,
    platforms: {} as PlatformStats,
    histogram: {} as HistogramStats,
  })

  const analysisLoading = ref(true)
  const tableLoading = ref(false)
  const error = ref('')
  const paginatedComments = ref<SingleResult[]>([])
  const totalAnalyzed = ref(0)

  const isProcessing = computed(
    () =>
      jobStatus.value?.status === 'processing' ||
      jobStatus.value?.status === 'pending'
  )
  const isValidJob = computed(() => !!jobStatus.value)

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
  const forceChartRerender = () => chartRerenderKey.value++
  watch(width, forceChartRerender)

  // // Store original pagination settings for print restore
  // const prePrintRowsPerPage = ref(10)
  // const prePrintFirst = ref(0)

  // const handleBeforePrint = () => {
  //   forceChartRerender()

  //   // Store current pagination state
  //   prePrintRowsPerPage.value = rowsPerPage.value
  //   prePrintFirst.value = first.value

  //   // Show all rows for printing
  //   rowsPerPage.value = totalComments.value
  //   first.value = 0

  //   // Synchronously load all data for print
  //   const data = [...(analysisData.value?.results ?? [])]
  //   paginatedComments.value = data
  // }

  // const handleAfterPrint = () => {
  //   // Restore original pagination after print
  //   rowsPerPage.value = prePrintRowsPerPage.value
  //   first.value = prePrintFirst.value
  //   fetchData(
  //     prePrintFirst.value / prePrintRowsPerPage.value,
  //     prePrintRowsPerPage.value
  //   )
  // }

  const isRtl = computed(
    () => locales.value.find((l) => l.code === locale.value)?.dir === 'rtl'
  )
  const chartsContainer = ref<HTMLDivElement>()

  // Fetch logic
  const fetchOverview = async () => {
    if (!jobId.value) return
    try {
      const response = await $fetch<AnalysisOverviewResponse>(
        `/api/analyze/${jobId.value}/overview`
      )
      if (response.success) {
        jobStatus.value = response.data.job

        const s = response.data.stats
        // Update stats
        stats.value.mainClasses = s.mainClasses
        stats.value.platforms = s.platforms
        stats.value.histogram = s.histogram

        if (jobStatus.value) {
          totalAnalyzed.value = jobStatus.value.processed_comments // or count from stats matches?
          const sum = s.mainClasses.reduce(
            (acc: number, curr: any) => acc + curr.count,
            0
          )
          totalAnalyzed.value = sum
        }
      }
    } catch (err) {
      console.error('Overview fetch error:', err)
    }
  }

  const fetchResults = async (page: number, rows: number) => {
    if (!jobId.value) return
    tableLoading.value = true
    try {
      // TODO: add types
      const response: any = await $fetch(
        `/api/analyze/${jobId.value}/results`,
        {
          params: {
            page: page + 1,
            limit: rows,
          },
        }
      )

      if (response.success) {
        paginatedComments.value = response.data.results.map(
          (r: SingleResult) => ({ ...r, _expanded: false })
        )
        // totalAnalyzed.value = response.data.processed // keep in sync
      }
    } catch (err) {
      console.error('Results fetch error', err)
    } finally {
      tableLoading.value = false
    }
  }

  let pollo: any = null

  onMounted(async () => {
    const id = route.query.id as string
    if (id) {
      jobId.value = id
      // Initial fetch
      await fetchOverview()

      // Trigger analysis if still pending (first load)
      if (jobStatus.value?.status === 'pending') {
        try {
          // Trigger partial analysis + background job
          await $fetch(`/api/analyze/${id}/analyze?limit=10`, {
            method: 'POST',
          })

          // Refresh status to see 'processing' and updated counts
          await fetchOverview()
        } catch (e) {
          console.error('Failed to trigger analysis:', e)
          error.value = $t('analyze.results.processingError')
        }
      }

      await fetchResults(0, rowsPerPage.value)
      analysisLoading.value = false

      // Start polling if needed
      if (isProcessing.value) {
        pollo = setInterval(async () => {
          await fetchOverview()
          if (!isProcessing.value) {
            clearInterval(pollo)
          }
        }, 2000)
      }
    } else {
      error.value = $t('analyze.results.noDataAvailable')
      analysisLoading.value = false
    }
  })

  onUnmounted(() => {
    // window.removeEventListener('beforeprint', handleBeforePrint)
    // window.removeEventListener('afterprint', handleAfterPrint)
    if (pollo) clearInterval(pollo)
  })

  // Table Handlers
  const first = ref(0)
  const rowsPerPage = ref(10)
  const rowsPerPageOptions = ref([5, 10, 20, 50])

  const onPage = (event: any) => {
    first.value = event.first
    rowsPerPage.value = event.rows
    fetchResults(event.page, event.rows)
  }
  // const onSort = () => {
  //   // TODO: on server side
  // }

  // Charts
  const showCustomize = ref(false)
  const showDownloadModal = ref(false)
  const chartsVisible = reactive({
    distribution: true,
    totals: false,
    platform: true,
    histogram: false,
  })
  const noChartVisible = computed(
    () =>
      !chartsVisible.distribution &&
      !chartsVisible.totals &&
      !chartsVisible.platform &&
      !chartsVisible.histogram
  )

  const dialectDisplay = computed(() => {
    const code = jobStatus.value?.dialect || region.value?.countryCode || '-'
    const match = supportedRegions.value.find((r) => r.countryCode === code)
    return match?.dialectName?.[locale.value] || code
  })

  const hasPlatforms = computed(
    () => Object.keys(stats.value.platforms).length > 0
  )

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
  // Bar Chart
  const barChartData = computed<ChartData<'bar'>>(() => {
    if (!isValidJob.value) return { labels: [], datasets: [] }

    const datasets = stats.value.mainClasses.map((c, i) => ({
      label: c.name,
      data: [c.count],
      backgroundColor: getChartColor(i),
      barThickness: 64,
      borderRadius: 6,
    }))
    return {
      labels: [t('analyze.results.charts.commentsAxis')],
      datasets,
    }
  })

  // Pie Chart
  const pieChartData = computed<ChartData<'doughnut'>>(() => {
    if (!isValidJob.value) return { labels: [], datasets: [] }
    return {
      labels: stats.value.mainClasses.map((c) => c.name),
      datasets: [
        {
          data: stats.value.mainClasses.map((c) => c.count),
          backgroundColor: stats.value.mainClasses.map((_, i) =>
            getChartColor(i)
          ),
          label: t('analyze.results.charts.commentsCountLabel'),
        },
      ],
    }
  })

  // Stacked Platform
  const platformStackedData = computed<ChartData<'bar'>>(() => {
    if (!isValidJob.value || !hasPlatforms.value)
      return { labels: [], datasets: [] }

    // stats.value.platforms is platform -> class -> count
    const platforms = Object.keys(stats.value.platforms)
    const classNames = stats.value.mainClasses.map((c) => c.name)

    const datasets = classNames.map((name, i) => {
      const data = platforms.map((p) => stats.value.platforms[p][name] || 0)
      return {
        label: name,
        data,
        backgroundColor: getChartColor(i),
      }
    })

    return { labels: platforms, datasets }
  })

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

  const generalChartsOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
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
  }

  const barOptions = reactive<ChartOptions<'bar'>>({
    ...generalChartsOptions,
    indexAxis: 'x',
    plugins: {
      ...generalChartsOptions.plugins,
      title: {
        display: true,
        text: t('analyze.results.charts.titles.totals'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })
  const doughnutOptions = reactive<ChartOptions<'doughnut'>>({
    ...generalChartsOptions,
    plugins: {
      ...generalChartsOptions.plugins,
      title: {
        display: true,
        text: t('analyze.results.charts.titles.distribution'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  const platformsBarOptions = reactive<ChartOptions<'bar'>>({
    ...generalChartsOptions,
    indexAxis: 'x',
    plugins: {
      ...generalChartsOptions.plugins,
      title: {
        display: true,
        text: t('analyze.results.charts.titles.platformStacked'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
  })

  // Histogram
  // Structure from API: className -> [count, count...]
  const histogramData = computed<ChartData<'bar'>>(() => {
    // TODO: return empty if is not bulk analysis
    if (!isValidJob.value) return { labels: [], datasets: [] }

    const bins = Array.from({ length: 10 }, (_, i) => i / 10)
    const labels = bins.map(
      (b) => `${(b * 100).toFixed(0)}–${((b + 0.1) * 100).toFixed(0)}%`
    )

    const datasets = stats.value.mainClasses.map((c, i) => {
      const counts = stats.value.histogram[c.name] || Array(10).fill(0)
      return {
        label: c.name,
        data: counts,
        backgroundColor: getChartColor(i),
      }
    })
    return { labels, datasets }
  })

  const histogramOptions = reactive<ChartOptions<'bar'>>({
    ...generalChartsOptions,
    indexAxis: 'x',
    plugins: {
      ...generalChartsOptions.plugins,
      title: {
        display: true,
        text: t('analyze.results.charts.titles.histogram'),
        position: 'bottom',
        font: {
          family: 'IBM Plex Sans Arabic',
        },
      },
    },
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

  // Filters ref (unused server-side for now but required for DataTable prop)
  const filters = ref({})
</script>

<style lang="postcss">
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

  /* Mobile & Print Table Style - Card Layout */
  @media (max-width: 768px), print {
    #dt-responsive-table table {
      width: 100% !important;
      max-width: 100% !important;
      display: block;
    }

    #dt-responsive-table table thead {
      /* hide the table header on mobile/print */
      display: none !important;
    }

    /* Styles for the table rows */
    #dt-responsive-table table tbody {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      min-height: auto !important;
    }

    /* Styles for individual table rows (cards) */
    #dt-responsive-table table tbody tr {
      @apply rounded-md border border-colors-neutral-placeholder shadow-md;
      display: table-row !important;
      margin-bottom: 1rem !important;
      background-color: #fff !important;
      padding: 1rem !important;
      break-inside: avoid;
    }
    /* Comment cell styling */
    #dt-responsive-table table tbody tr .comment-cell {
      width: 100%;
      direction: rtl;
      overflow: hidden;
      white-space: normal;
      line-height: 1.5;
    }

    /* Styles for table cells within rows */
    #dt-responsive-table table tbody td {
      margin: 0.5rem 0 !important;
      display: block !important;
      width: 100% !important;
      min-width: 100% !important;
      span {
        text-align: center;
      }
    }
    #dt-responsive-table table tbody td:last-child {
      border: none !important;
    }
  }

  /* Mobile-only pagination styles */
  @media (max-width: 768px) {
    #dt-responsive-table .p-paginator-content .p-select {
      width: 100%;
      order: 0;
    }
    #dt-responsive-table .p-paginator-content .p-paginator-current {
      width: 100%;
      order: 1;
      text-align: center;
    }
    #dt-responsive-table .p-paginator-content button {
      order: 2;
    }
  }

  /* Mobile-only pagination styles */
  @media (max-width: 768px) {
    #dt-responsive-table .p-paginator-content .p-select {
      width: 100%;
      order: 0;
    }
    #dt-responsive-table .p-paginator-content .p-paginator-current {
      width: 100%;
      order: 1;
      text-align: center;
    }
    #dt-responsive-table .p-paginator-content button {
      order: 2;
    }
  }

  /* remove shadows in print */
  @media print {
    #dt-responsive-table table tbody tr {
      box-shadow: none !important;
    }
  }
</style>
