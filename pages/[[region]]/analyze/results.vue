<!-- DEV: WIP -->
<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('analyze.results.title')"
      use-h1
    >
      <template #second-col>
        <div class="flex flex-wrap">
          <div class="flex flex-col gap-2 md:ms-auto max-md:mt-4 max-md:mx-auto print:hidden">
            <UiButton
              class="w-52 ms-auto"
            >
              <!-- TODO: on click, open a UiModal with download options (PDF, JSON, CSV, ...) -->
              {{ $t('analyze.results.actions.download') }}
              <template #icon>
                <Icon name="mdi:download" />
              </template>
            </UiButton>
            <UiButton
              class="w-52 ms-auto"
              variant="outline"
              @click="handlePrint"
            >
              {{ $t('analyze.results.actions.print') }}
              <template #icon>
                <Icon name="mdi:printer" />
              </template>
            </UiButton>
            <UiButton
              class="w-52 ms-auto md:!hidden"
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

    
    <div v-if="analysisData">
      <div
        class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6"
        :class="{'print:hidden': noChartVisible}"
      >
        <UiPageHeading
          v-if="analysisData"
          id="results-overview"
          :title="$t('analyze.results.overview')"
          class="[&_h2]:font-normal !my-0"
        >
        <template #second-col>
          <UiButton
            variant="ghost"
            class="w-52 md:ms-auto max-md:me-auto print:!hidden"
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
          <div class="grid grid-cols-1 print:!grid-cols-1 md:grid-cols-2 gap-6 py-12 max-sm:py-6 print:py-6">
            <div v-if="noChartVisible">
              {{ $t('analyze.results.noChartSelected') }}
            </div>
            <!-- Show only Distribution and Platform (if available) by default; others controlled via modal -->
            <ChartDoughnut
              v-if="chartsVisible.distribution"
              class="!w-3/4 m-auto break-inside-avoid"
              :chart-data="pieChartData"
              :options="doughnutOptions"
            />

            <ChartBar
              v-if="chartsVisible.platform && hasPlatforms"
              class="!w-full m-auto break-inside-avoid"
              :chart-data="platformStackedData"
              :options="platformsBarOptions"
            />

            <ChartBar
              v-if="chartsVisible.totals"
              class="!w-full m-auto break-inside-avoid"
              :chart-data="barChartData"
              :options="barOptions"
            />

            <ChartBar
              v-if="chartsVisible.histogram"
              class="!w-full m-auto break-inside-avoid"
              :chart-data="histogramData"
              :options="histogramOptions"
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
              <input v-model="chartsVisible.distribution" type="checkbox">
              <span>{{ $t('analyze.results.charts.distribution') }}</span>
            </label>
            <label class="checkbox-label">
              <input v-model="chartsVisible.totals" type="checkbox">
              <span>{{ $t('analyze.results.charts.totals') }}</span>
            </label>
            <label
              class="checkbox-label"
              :class="{ 'opacity-50 pointer-events-none': !hasPlatforms }"
              :title="!hasPlatforms ? $t('analyze.results.noChartSelected') : ''"
            >
              <input v-model="chartsVisible.platform" type="checkbox" :disabled="!hasPlatforms">
              <span>{{ $t('analyze.results.charts.platformStacked') }}</span>
            </label>
            <label class="checkbox-label">
              <input v-model="chartsVisible.histogram" type="checkbox">
              <span>{{ $t('analyze.results.charts.histogram') }}</span>
            </label>
          </div>
        </UiModal>
      </div>

      <!-- General Analysis Summary -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6 break-inside-avoid">
        <h2 class="font-normal mb-4">{{ $t('analyze.results.summary.title') }}</h2>
        
        <div class="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mb-6">
            <div class="text-center p-4 bg-colors-analysis-hate-100 rounded-lg border border-colors-analysis-hate-200">
              <div class="text-2xl font-bold text-colors-analysis-hate-600">
              {{ analysisData.general_analysis.hate_speech_percentage }}%
            </div>
              <div class="text-sm text-colors-analysis-hate-600">{{ $t('analyze.results.summary.hate') }}</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.hate_speech_count }} {{ $t('analyze.results.summary.commentsLabel') }}
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>{{ $t('analyze.results.summary.confidence') }}</div>
              <div>
                {{ (analysisData.general_analysis.hate_speech_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
          
          <div class="text-center p-4 bg-colors-analysis-nonhate-100 rounded-lg border border-colors-analysis-nonhate-200">
            <div class="text-2xl font-bold text-colors-analysis-nonhate-600">
              {{ analysisData.general_analysis.non_hate_speech_percentage }}%
            </div>
            <div class="text-sm text-colors-analysis-nonhate-600">{{ $t('analyze.results.summary.nonhate') }}</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.non_hate_speech_count }} {{ $t('analyze.results.summary.commentsLabel') }}
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>{{ $t('analyze.results.summary.confidence') }}</div>
              <div>
                {{ (analysisData.general_analysis.non_hate_speech_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
          <div class="text-center p-4 bg-colors-analysis-neutral-100 rounded-lg border border-colors-analysis-neutral-200">
            <div class="text-2xl font-bold text-colors-analysis-neutral-600">
              {{ analysisData.general_analysis.neutral_percentage }}%
            </div>
            <div class="text-sm text-colors-analysis-neutral-600">{{ $t('analyze.results.summary.neutral') }}</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.neutral_count }} {{ $t('analyze.results.summary.commentsLabel') }}
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>{{ $t('analyze.results.summary.confidence') }}</div>
              <div>
                {{ (analysisData.general_analysis.neutral_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
        </div>
        
        <div class="flex flex-wrap print:justify-center gap-4 items-center">
          <small v-if="analysisData?.general_analysis" class="flex items-center gap-1">
            <Icon name="mdi:info-outline" class="text-colors-neutral-placeholder text-base" />
            <strong>{{ $t('analyze.results.summary.totalLabel') }}</strong>
              {{ analysisData.general_analysis.neutral_count + analysisData.general_analysis.hate_speech_count + analysisData.general_analysis.non_hate_speech_count }}
              {{ $t('analyze.results.summary.commentsWord') }}
          </small>
          <small>
            <strong>{{ $t('analyze.results.summary.dialect') }}</strong> {{ dialectDisplay }}
          </small>
          <small>
            <strong>{{ $t('analyze.results.summary.modelVersion') }}</strong> {{ analysisData.general_analysis.model_version }}
          </small>
        </div>
      </div>
      
      <!-- Comments Details -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 break-inside-avoid">
        <h2 class="font-normal mb-4">{{ $t('analyze.results.details.title') }}</h2>
        
        <pv-DataTable
          v-model:filters="filters"
          :value="paginatedComments"
          :rows="rowsPerPage"
          :total-records="totalRecords"
          :lazy="true"
          :paginator="true"
          :rows-per-page-options="[5, 10, 20, 50]"
          :loading="loading"
          :global-filter-fields="['originalComment', 'platform', 'date', 'label']"
          filter-display="menu"
          column-resize-mode="fit"
          resizable-columns
          paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          :current-page-report-template="$t('analyze.results.details.pagination.showing', { first: '{first}', last: '{last}', total: '{totalRecords}' })"
          class="py-8 px-4 rounded-md"
          @page="onPage"
          @sort="onSort"
          @filter="onFilter"
        >
          <template #empty>
            <div class="text-center py-8 text-gray-500">
              {{ $t('analyze.results.details.pagination.noData') }}
            </div>
          </template>
          
          <template #loading>
            <div class="text-center p-12 bg-colors-neutral-background rounded-md">
              <Icon name="mdi:loading" class="animate-spin text-2xl text-colors-primary" />
              <p class="mt-2 text-colors-neutral-placeholder">{{ $t('misc.loading') }}</p>
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
            <!-- <template #filter="{ filterModel, filterCallback }">
              <input
                v-model="filterModel.value"
                type="text"
                class="w-full p-2 border border-gray-300 rounded text-sm"
                :placeholder="$t('analyze.results.details.filters.global')"
                @input="filterCallback()"
              >
            </template> -->
          </pv-Column>

          <pv-Column 
            field="platform" 
            :header="$t('analyze.results.details.headers.platform')"
            :sortable="true"
          >
            <template #body="{ data }">
              {{ data.platform || $t('analyze.results.details.na') }}
            </template>

            <!-- <template #filter="{ filterModel, filterCallback }">
              <pv-Select
                v-model="filterModel.value"
                option-label="name"
                :options="[
                  { key: '', name: $t('analyze.results.details.filters.platform') },
                  ...(platforms.map((p: string) => ({ key: p, name: p })))
                  ]"
                @change="filterCallback()"
              />
                <option value="">{{ $t('analyze.results.details.filters.platform') }}</option>
                <option v-for="platform in platforms" :key="platform" :value="platform">
                  {{ platform }}
                </option>
              </pv-Select>
            </template> -->
          </pv-Column>

          <pv-Column 
            field="date" 
            :header="$t('analyze.results.details.headers.date')"
            :sortable="true"
          >
            <template #body="{ data }">
              {{ data.date || $t('analyze.results.details.na') }}
            </template>
          </pv-Column>

          <pv-Column 
            field="label" 
            :header="$t('analyze.results.details.headers.classification')"
            :sortable="true"
          >
            <template #body="{ data }">
              <ResultScoreLabel :label="data.label" />
            </template>
            <!-- <template #filter="{ filterModel, filterCallback }">
              <select
                v-model="filterModel.value"
                class="w-full p-2 border border-gray-300 rounded text-sm"
                @change="filterCallback()"
              >
                <option value="">{{ $t('analyze.results.details.filters.classification') }}</option>
                <option value="hate-speech">hate-speech</option>
                <option value="non-hate-speech">non-hate-speech</option>
                <option value="neutral">neutral</option>
              </select>
            </template> -->
          </pv-Column>

          <pv-Column 
            field="score" 
            :header="$t('analyze.results.details.headers.score')"
            :sortable="true"
          >
            <template #body="{ data }">
              <ResultScoreBar :score="data.score" :label="data.label" />
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
        @close="error = ''"
      />
    </div>
    
    <div v-else class="mt-8 mx-auto text-center">
      <p class="text-gray-600">{{ $t('analyze.results.noDataAvailable') }}</p>
    </div>
    <UiButton 
      class="mt-4 mx-auto w-fit flex-row-reverse print:!hidden"
      :to="$localePath('/analyze')"
    >
      {{ $t('analyze.results.backToAnalyze') }}
      <template #icon>
        <Icon
          name="mdi:arrow-left"
          size="24"
          class="rtl:rotate-180"
        />
      </template>
    </UiButton>
  </div>
</template>

<script lang="ts" setup>
import type { ChartData, ChartOptions } from 'chart.js'
import type { AIAnalysisResponse } from '~/types/analyze'
import { analysisColors } from '~/utils/colors'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const { supportedRegions } = useGeolocation()
const { locale, locales, t } = useI18n()

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const analysisData = ref<AIAnalysisResponse | null>(null)
const error = ref('')
const isRtl = computed(() => locales.value.find((l) => l.code === locale.value)?.dir === 'rtl')

// TODO: STORE ANALYSIS DATA ELSEWHERE
onMounted(() => {
  // Get analysis data from query parameters
  if (route.query.data) {
    try {
      const data = JSON.parse(String(route.query.data))
      analysisData.value = data as AIAnalysisResponse
    } catch (err) {
      console.error('Error parsing analysis data:', err)
      error.value = 'Invalid analysis data received'
    }
  } else {
    error.value = 'No analysis data available'
  }
})

const handlePrint = () => {
  window.print()
}

// Charts visibility state + modal toggle
const showCustomize = ref(false)
const chartsVisible = reactive({
  distribution: true, // doughnut chart
  totals: false,      // totals horizontal bar
  platform: true,     // stacked by platform
  histogram: false    // score histogram
})
const noChartVisible = computed(
  () => !(chartsVisible.distribution || chartsVisible.totals
  || chartsVisible.platform || chartsVisible.histogram))

const dialectDisplay = computed(() => {
  const data = analysisData.value
  if (!data?.general_analysis?.model_dialect) return '—'
  const code = data.general_analysis.model_dialect
  const match = supportedRegions.value.find(r => r.countryCode === code)
  return match?.dialectName?.[locale.value] || code
})

// Datasets and options
const barChartData = computed<ChartData<'bar'>>(() => ({
  labels: [t('analyze.results.charts.commentsAxis')],
  datasets: [
    {
      label: t('analyze.results.summary.hate'),
      data: [
        analysisData.value?.general_analysis.hate_speech_count ?? 0,
      ],
      backgroundColor: analysisColors.hate,
      barThickness: 64,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0000'
    },
    {
      label: t('analyze.results.summary.nonhate'),
      data: [
        analysisData.value?.general_analysis.non_hate_speech_count ?? 0
      ],
      backgroundColor: analysisColors.nonhate,
      barThickness: 64,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0000'
    },
    ...(analysisData.value && analysisData.value.general_analysis.neutral_count > 0 ? [{
      label: t('analyze.results.summary.neutral'),
      data: [
        analysisData.value.general_analysis.neutral_count
      ],
      backgroundColor: analysisColors.neutral,
      barThickness: 64,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0000'
    }] : [])
  ],
}))

const pieChartData = computed<ChartData<'doughnut'>>(() => ({
  labels: [t('analyze.results.summary.hate'), t('analyze.results.summary.nonhate'), t('analyze.results.summary.neutral')],
  datasets: [
    {
      data: [
        analysisData.value?.general_analysis.hate_speech_count ?? 0,
        analysisData.value?.general_analysis.non_hate_speech_count ?? 0,
        analysisData.value?.general_analysis.neutral_count ?? 0,
      ],
      backgroundColor: [analysisColors.hate, analysisColors.nonhate, analysisColors.neutral],
      label: t('analyze.results.charts.commentsCountLabel'),
    },
  ],
}))

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
        family: "IBM Plex Sans Arabic",
      },
    },
    legend: {
      align: 'center',
      labels: {
        font: {
          family: "IBM Plex Sans Arabic",
        },
      },
      rtl: isRtl.value,
    },
    tooltip: {
      rtl: isRtl.value,
      titleFont: {
        family: "IBM Plex Sans Arabic"
      },
      bodyFont: {
        family: "IBM Plex Sans Arabic"
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
        family: "IBM Plex Sans Arabic",
      },
    },
    legend: {
      align: 'center',
      labels: {
        font: {
          family: "IBM Plex Sans Arabic",
        },
      },
      rtl: isRtl.value,
    },
    tooltip: {
      rtl: isRtl.value,
      titleFont: {
        family: "IBM Plex Sans Arabic"
      },
      bodyFont: {
        family: "IBM Plex Sans Arabic"
      },
    }
  }
})

// Stacked bar: labels per platform
const platforms = computed(() => {
  const set = new Set<string>()
  for (const c of analysisData.value?.comments_details ?? []) {
    set.add(c.platform || 'Unknown')
  }
  return Array.from(set)
})

const platformStackedData = computed<ChartData<'bar'>>(() => {
  const base = Object.fromEntries(platforms.value.map(p => [p, { hate: 0, non: 0, neutral: 0 }]))
  for (const c of analysisData.value?.comments_details ?? []) {
    const p = c.platform || 'Unknown'
    if (c.label === 'hate-speech') base[p].hate++
    else if (c.label === 'non-hate-speech') base[p].non++
    else base[p].neutral++
  }
  const labels = platforms.value
  return {
    labels,
    datasets: [
      { label: t('analyze.results.summary.hate'), data: labels.map(l => base[l].hate), backgroundColor: analysisColors.hate },
      { label: t('analyze.results.summary.nonhate'), data: labels.map(l => base[l].non), backgroundColor: analysisColors.nonhate },
      { label: t('analyze.results.summary.neutral'), data: labels.map(l => base[l].neutral), backgroundColor: analysisColors.neutral }
    ],
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
        family: "IBM Plex Sans Arabic",
      },
    },
    legend: {
      align: 'center',
      labels: {
        font: {
          family: "IBM Plex Sans Arabic",
        },
      },
      rtl: isRtl.value,
    },
    tooltip: {
      rtl: isRtl.value,
      titleFont: {
        family: "IBM Plex Sans Arabic"
      },
      bodyFont: {
        family: "IBM Plex Sans Arabic"
      },
    },
  },
})

const histogramData = computed<ChartData<'bar'>>(() => {
  const bins = Array.from({ length: 10 }, (_, i) => i / 10)
  const labels = bins.map(b => `${(b * 100).toFixed(0)}–${((b + 0.1) * 100).toFixed(0)}%`)
  const counts = {
    hate: Array(10).fill(0),
    non: Array(10).fill(0),
    neutral: Array(10).fill(0)
  }
  for (const c of analysisData.value?.comments_details ?? []) {
    const idx = Math.min(9, Math.floor(c.score * 10))
    if (c.label === 'hate-speech') counts.hate[idx]++
    else if (c.label === 'non-hate-speech') counts.non[idx]++
    else counts.neutral[idx]++
  }
  return {
    labels,
    datasets: [
      { label: t('analyze.results.summary.hate'), data: counts.hate, backgroundColor: analysisColors.hate },
      { label: t('analyze.results.summary.nonhate'), data: counts.non, backgroundColor: analysisColors.nonhate },
      { label: t('analyze.results.summary.neutral'), data: counts.neutral, backgroundColor: analysisColors.neutral }
    ]
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
        family: "IBM Plex Sans Arabic",
      },
    },
    legend: {
      align: 'center',
      labels: {
        font: {
          family: "IBM Plex Sans Arabic",
        },
      },
      rtl: isRtl.value,
    },
    tooltip: {
      rtl: isRtl.value,
      titleFont: {
        family: "IBM Plex Sans Arabic"
      },
      bodyFont: {
        family: "IBM Plex Sans Arabic",
      },
    },
  },
})

// whether there are platforms available
const hasPlatforms = computed(() => platforms.value.length > 0)

// DataTable state and functionality
const filters = ref({})
// const showFilters = ref(false)
const loading = ref(false)
const first = ref(0)
const rowsPerPage = ref(10)

const initFilters = () => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      originalComment: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      platform: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
      },
      label: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      }
      // balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      // status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      // activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
      // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
  };
};
onMounted(() => {
  initFilters()
})

// Paginated data for server-side simulation
const paginatedComments = ref<Array<{
  originalComment: string
  platform?: string
  date?: string
  label: "hate-speech" | "non-hate-speech" | "neutral"
  score: number
}>>([])
const totalRecords = computed(() => analysisData.value?.comments_details?.length ?? 0)

// Server-side pagination simulation
const fetchData = (page: number, rows: number, sortField?: string, sortOrder?: number, filters?: Record<string, { value: string }>) => {
  loading.value = true
  
  // Simulate server delay
  // TODO: replace with actual server pagination
  setTimeout(() => {
    let data = [...(analysisData.value?.comments_details ?? [])]
    
    // Apply filters
    if (filters) {
      Object.keys(filters).forEach(key => {
        const filter = filters[key]
        if (filter && filter.value && filter.value.key !== '') {
          data = data.filter(item => {
            const value = item[key as keyof typeof item]
            if (typeof value === 'string') {
              return value.toLowerCase().includes(filter.value.key.toLowerCase())
            }
            return String(value).toLowerCase().includes(filter.value.key.toLowerCase())
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
          return sortOrder === 1 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
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
const onPage = (event: { first: number; rows: number; page: number; sortField?: string; sortOrder?: number }) => {
  first.value = event.first
  rowsPerPage.value = event.rows
  fetchData(event.page, event.rows, event.sortField, event.sortOrder, filters.value)
}
const onSort = (event: { sortField: string; sortOrder: number }) => {
  fetchData(first.value / rowsPerPage.value, rowsPerPage.value, event.sortField, event.sortOrder, filters.value)
}
const onFilter = (event: { filters: Record<string, any> }) => {
  filters.value = event.filters
  fetchData(0, rowsPerPage.value, undefined, undefined, event.filters)
}

// Initialize data when analysisData changes
watch(analysisData, () => {
  if (analysisData.value) {
    fetchData(0, rowsPerPage.value)
  }
}, { immediate: true })
</script>
<style scoped lang="postcss">
input[type=checkbox] {
  @apply accent-colors-primary scale-125; 
}
.checkbox-label {
  @apply flex items-center gap-2 p-2 rounded-md;
  @apply hover:bg-colors-primary-light transition-colors duration-200;
}
</style>
<style lang="postcss">
.p-datatable {
  .p-datatable-mask {
    @apply bg-colors-neutral-placeholder bg-opacity-50 rounded-md;
  }
  .p-datatable-tbody > tr {
    @apply border-b border-colors-neutral-placeholder;
    &:hover {
      @apply bg-colors-analysis-neutral-50;
    }
  }
}
.p-select {
  @apply focus:!border-colors-primary-active hover:!border-colors-primary-active active:!border-colors-primary-active  !shadow-none;
}
.p-select-option.p-select-option-selected {
  @apply !bg-colors-analysis-neutral-500 hover:!bg-colors-analysis-neutral-600 !text-colors-neutral-background;
}
.p-paginator, .p-datatable-paginator-bottom {
  @apply print:!hidden;
}
</style>