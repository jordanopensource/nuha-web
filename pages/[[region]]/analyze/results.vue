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
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6">
        <UiPageHeading
          v-if="analysisData"
          id="results-overview"
          title="Overview"
          class="[&_h2]:font-normal"
        >
        <template #second-col>
          <UiButton
            variant="ghost"
            class="w-52 md:ms-auto max-md:me-auto print:!hidden"
          >
            <!-- TODO: i18n -->
            <!-- TODO: on click, open a UiModal with customization and charts options -->
            Customize Charts
            <template #icon>
              <Icon name="mdi:pencil" />
            </template>
          </UiButton>
        </template>
        </UiPageHeading>
        <!-- Charts -->
        <ClientOnly>
          <div class="grid grid-cols-1 print:!grid-cols-1 md:grid-cols-2 gap-6 mb-6 py-12">
            <ChartDoughnut class="!w-3/4 m-auto" :chart-data="pieChartData" :options="pieOptions" />
            <ChartBar class="!w-full m-auto" :chart-data="barChartData" :options="barOptions" />
            <ChartBar class="!w-full m-auto" :chart-data="platformStackedData" :options="platformsBarOptions" />
            <ChartBar class="!w-full m-auto" :chart-data="histogramData" :options="histogramOptions" />
            <!-- <ChartPie class="!w-3/4 my-auto" :chart-data="pieChartData" :options="pieOptions" /> -->
          </div>
        </ClientOnly>
      </div>

      <!-- General Analysis Summary -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6">
        <h2 class="font-normal mb-4">Analysis Summary</h2>
        
        <div class="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mb-6">
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">
              {{ analysisData.general_analysis.hate_speech_percentage }}%
            </div>
            <div class="text-sm text-red-700">Hate Speech</div>
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
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">
              {{ analysisData.general_analysis.non_hate_speech_percentage }}%
            </div>
            <div class="text-sm text-green-700">Not-Hate Speech</div>
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
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">
              {{ analysisData.general_analysis.neutral_percentage }}%
            </div>
            <div class="text-sm text-blue-700">Neutral Comments</div>
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
            <strong>Dialect:</strong> {{
              supportedRegions.find(r => r.countryCode === analysisData.general_analysis.model_dialect)?.dialectName[locale]
            }}
          </small>
          <small>
            <strong>Model Version:</strong> {{ analysisData.general_analysis.model_version }}
          </small>
        </div>
      </div>
      
      <!-- Comments Details -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6">
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
                      'bg-red-100 text-red-800': comment.label === 'hate-speech',
                      'bg-green-100 text-green-800': comment.label === 'non-hate-speech',
                      'bg-gray-100 text-gray-800': comment.label === 'neutral'
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
                          'bg-red-500': comment.label === 'hate-speech',
                          'bg-green-500': comment.label === 'non-hate-speech',
                          'bg-gray-500': comment.label === 'neutral'
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
      
      <!-- DEV: Raw JSON Data (for development) -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Raw Analysis Data (Development)</h2>
        <pre class="text-xs text-gray-600 overflow-auto max-h-96 whitespace-pre-wrap">{{ JSON.stringify(analysisData, null, 2) }}</pre>
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
import { UiButton } from '#components'
import type { ChartData, ChartOptions } from 'chart.js'
import type { AIAnalysisResponse } from '~/types/analyze'

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
      backgroundColor: '#EF5675',
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
      backgroundColor: '#374C80',
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
      backgroundColor: '#003F5C',
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
      backgroundColor: ['#EF5675', '#374C80', '#003F5C'],
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
      { label: 'Hate', data: labels.map(l => base[l].hate), backgroundColor: '#EF5675' },
      { label: 'Not-Hate', data: labels.map(l => base[l].non), backgroundColor: '#374C80' },
      { label: 'Neutral', data: labels.map(l => base[l].neutral), backgroundColor: '#003F5C' }
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
      { label: 'Hate', data: counts.hate, backgroundColor: '#EF5675' },
      { label: 'Not-Hate', data: counts.non, backgroundColor: '#374C80' },
      { label: 'Neutral', data: counts.neutral, backgroundColor: '#003F5C' }
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
</script>