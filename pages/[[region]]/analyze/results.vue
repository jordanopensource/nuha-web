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
              <!-- TODO: i18n -->
              <!-- TODO: on click, open a UiModal with download options (PDF, JSON, CSV, ...) -->
              Download Results
              <template #icon>
                <Icon name="mdi:download" />
              </template>
            </UiButton>
            <UiButton
              class="w-52 ms-auto"
              variant="outline"
            >
              <!-- TODO: i18n -->
              Print
              <template #icon>
                <Icon name="mdi:printer" />
              </template>
            </UiButton>
            <UiButton
              class="w-52 ms-auto md:!hidden"
              variant="ghost"
              to="#results-overview"
            >
              <!-- TODO: i18n -->
              Jump to results
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
          title="Overview"
          class="[&_h2]:font-normal !my-0"
        >
        <template #second-col>
          <UiButton
            variant="ghost"
            class="w-52 md:ms-auto max-md:me-auto print:!hidden"
            @click="showCustomize = true"
          >
            <!-- TODO: i18n -->
            Customize Charts
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
              No chart selected
            </div>
            <!-- Show only Distribution and Platform (if available) by default; others controlled via modal -->
            <ChartDoughnut
              v-if="chartsVisible.distribution"
              class="!w-3/4 m-auto break-inside-avoid"
              :chart-data="pieChartData"
              :options="pieOptions"
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
        <!-- TODO: i18n -->
        <UiModal
          v-model="showCustomize"
          title="Customize Charts"
          size="md"
          cancel-button-text="Done"
          :show-action-button="false"
          @close="showCustomize = false"
        >
          <div class="space-y-4 [&_input[type=checkbox]]:accent-colors-primary">
            <label class="flex items-center gap-2">
              <input v-model="chartsVisible.distribution" type="checkbox">
              <span>Distribution (Doughnut)</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="chartsVisible.totals" type="checkbox">
              <span>Total by Classification</span>
            </label>
            <label
              class="flex items-center gap-2"
              :class="{ 'opacity-50 pointer-events-none': !hasPlatforms }"
              :title="!hasPlatforms ? 'No platform data available' : ''"
            >
              <input v-model="chartsVisible.platform" type="checkbox" :disabled="!hasPlatforms">
              <span>By Platform (Stacked)</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="chartsVisible.histogram" type="checkbox">
              <span>Confidence Score Distribution</span>
            </label>
          </div>
        </UiModal>
      </div>

      <!-- General Analysis Summary -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6 break-inside-avoid">
        <h2 class="font-normal mb-4">Analysis Summary</h2>
        
        <div class="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mb-6">
            <div class="text-center p-4 bg-colors-analysis-hate-100 rounded-lg border border-colors-analysis-hate-200">
              <div class="text-2xl font-bold text-colors-analysis-hate-600">
              {{ analysisData.general_analysis.hate_speech_percentage }}%
            </div>
              <div class="text-sm text-colors-analysis-hate-600">Hate Speech</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.hate_speech_count }} comments
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>Confidence Score:</div>
              <div>
                {{ (analysisData.general_analysis.hate_speech_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
          
          <!-- TODO: for not-hate speech, use the same color for its chart color -->
          <div class="text-center p-4 bg-colors-analysis-nonhate-100 rounded-lg border border-colors-analysis-nonhate-200">
            <div class="text-2xl font-bold text-colors-analysis-nonhate-600">
              {{ analysisData.general_analysis.non_hate_speech_percentage }}%
            </div>
            <div class="text-sm text-colors-analysis-nonhate-600">Not-Hate Speech</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.non_hate_speech_count }} comments
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>Confidence Score:</div>
              <div>
                {{ (analysisData.general_analysis.non_hate_speech_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
          <div class="text-center p-4 bg-colors-analysis-neutral-100 rounded-lg border border-colors-analysis-neutral-200">
            <div class="text-2xl font-bold text-colors-analysis-neutral-600">
              {{ analysisData.general_analysis.neutral_percentage }}%
            </div>
            <div class="text-sm text-colors-analysis-neutral-600">Neutral Comments</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.neutral_count }} comments
            </div>
            <small class="flex gap-1 justify-center mt-2">
              <div>Confidence Score:</div>
              <div>
                {{ (analysisData.general_analysis.neutral_confidence_score * 100).toFixed(1) }}%
              </div>
            </small>
          </div>
        </div>
        
        <div class="flex flex-wrap print:justify-center gap-4 items-center">
          <!-- TODO: i18n -->
          <small v-if="analysisData?.general_analysis" class="flex items-center gap-1">
            <Icon name="mdi:info-outline" class="text-colors-neutral-placeholder text-base" />
            <strong>Total:</strong>
              {{ analysisData.general_analysis.neutral_count + analysisData.general_analysis.hate_speech_count + analysisData.general_analysis.non_hate_speech_count }}
              Comments
          </small>
          <small>
            <strong>Dialect:</strong> {{ dialectDisplay }}
          </small>
          <small>
            <strong>Model Version:</strong> {{ analysisData.general_analysis.model_version }}
          </small>
        </div>
      </div>
      
      <!-- Comments Details -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 break-inside-avoid">
        <h2 class="font-normal mb-4">Comments Analysis Details</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left p-3 font-semibold">Comment</th>
                <th class="text-left p-3 font-semibold">Platform</th>
                <th class="text-left p-3 font-semibold">Date</th>
                <th class="text-left p-3 font-semibold">Classification</th>
                <th class="text-left p-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(comment, index) in analysisData.comments_details" 
                :key="index"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="p-3 max-w-md">
                  <div class="truncate" :title="comment.originalComment">
                    {{ comment.originalComment }}
                  </div>
                </td>
                <td class="p-3">{{ comment.platform || 'N/A' }}</td>
                <td class="p-3">{{ comment.date || 'N/A' }}</td>
                <td class="p-3">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-colors-analysis-hate-100 text-colors-analysis-hate-800': comment.label === 'hate-speech',
                      'bg-colors-analysis-nonhate-100 text-colors-analysis-nonhate-800': comment.label === 'non-hate-speech',
                      'bg-colors-analysis-neutral-100 text-colors-analysis-neutral-800': comment.label === 'neutral'
                    }"
                  >
                    {{ comment.label }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-mono">{{ (comment.score * 100).toFixed(1) }}%</span>
                    <div class="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full"
                        :class="{
                          'bg-colors-analysis-hate-600': comment.label === 'hate-speech',
                          'bg-colors-analysis-nonhate-600': comment.label === 'non-hate-speech',
                          'bg-colors-analysis-neutral-600': comment.label === 'neutral'
                        }"
                        :style="{ width: `${comment.score * 100}%` }"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
      <p class="text-gray-600">No analysis data available.</p>
    </div>
    <UiButton 
      class="mt-4 mx-auto w-fit flex-row-reverse print:!hidden"
      :to="$localePath('/analyze')"
    >
      <!-- TODO: i18n -->
      Back to Analyze
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

const { supportedRegions } = useGeolocation()
const { locale } = useI18n()

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const analysisData = ref<AIAnalysisResponse | null>(null)
const error = ref('')

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
  // TODO: i18n for the charts' labels
const barChartData = computed<ChartData<'bar'>>(() => ({
  labels: ['Comments'],
  datasets: [
    {
      label: "Hate Speech",
      data: [
        analysisData.value?.general_analysis.hate_speech_count ?? 0,
        // analysisData.value?.general_analysis.non_hate_speech_count ?? 0
      ],
      // TODO: get the chart colors from a unified config
  backgroundColor: analysisColors.hate,
      barThickness: 64,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#0000'
    },
    {
      label: "Not Hate Speech",
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
      label: "Neutral",
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
  labels: ['Hate', 'Not-Hate', 'Neutral'],
  datasets: [
    {
      data: [
        analysisData.value?.general_analysis.hate_speech_count ?? 0,
        analysisData.value?.general_analysis.non_hate_speech_count ?? 0,
        analysisData.value?.general_analysis.neutral_count ?? 0,
      ],
  backgroundColor: [analysisColors.hate, analysisColors.nonhate, analysisColors.neutral],
      label: "# of comments",
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
      text: 'Total Comments by Classification (Count)', // TODO: i18n
      position: 'bottom',
    },
    legend: {
      align: 'center',
    },
  },
})
// Options for both pie and douhgnut charts
const pieOptions = reactive<ChartOptions<'doughnut'>>({
  responsive: false,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "Distribution of Comments by Classification (%)", // TODO: i18n
      position: 'bottom'
    },
    legend: {
      align: 'center',
    },
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
  { label: 'Hate', data: labels.map(l => base[l].hate), backgroundColor: analysisColors.hate },
  { label: 'Not-Hate', data: labels.map(l => base[l].non), backgroundColor: analysisColors.nonhate },
  { label: 'Neutral', data: labels.map(l => base[l].neutral), backgroundColor: analysisColors.neutral }
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
      text: 'Comments by Platform and Classification (Stacked)', // TODO: i18n
      position: 'bottom',
    },
    legend: {
      align: 'center',
    },
  },
})

// Score histogram (0..1 in 10 bins), stacked by label
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
  { label: 'Hate', data: counts.hate, backgroundColor: analysisColors.hate },
  { label: 'Not-Hate', data: counts.non, backgroundColor: analysisColors.nonhate },
  { label: 'Neutral', data: counts.neutral, backgroundColor: analysisColors.neutral }
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
      text: 'Confidence Score Distribution by Classification (0-100%)', // TODO: i18n
      position: 'bottom',
    },
    legend: {
      align: 'center',
    },
  },
})

// whether there are platforms available
const hasPlatforms = computed(() => platforms.value.length > 0)
</script>
