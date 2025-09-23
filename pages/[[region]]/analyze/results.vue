<!-- DEV: WIP -->
<template>
  <div class="page-container">
    <UiPageHeading 
      :title="$t('analyze.results.title')"
      use-h1
      :subtitle="$t('analyze.results.subtitle')" 
    />
    
    <div v-if="analysisData" class="mt-8">
      <!-- General Analysis Summary -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-colors-primary">Analysis Summary</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">
              {{ analysisData.general_analysis.hate_speech_percentage }}%
            </div>
            <div class="text-sm text-red-700">Hate Speech</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.hate_speech_count }} comments
            </div>
          </div>
          
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">
              {{ analysisData.general_analysis.non_hate_speech_percentage }}%
            </div>
            <div class="text-sm text-green-700">Non-Hate Speech</div>
            <div class="text-xs text-gray-600">
              {{ analysisData.general_analysis.non_hate_speech_count }} comments
            </div>
          </div>
          
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">
              {{ (analysisData.general_analysis.hate_speech_confidence_score * 100).toFixed(1) }}%
            </div>
            <div class="text-sm text-blue-700">Hate Speech Confidence</div>
          </div>
          
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">
              {{ (analysisData.general_analysis.non_hate_speech_confidence_score * 100).toFixed(1) }}%
            </div>
            <div class="text-sm text-blue-700">Non-Hate Speech Confidence</div>
          </div>
        </div>
        
        <div class="text-sm text-gray-600">
          <strong>Model Version:</strong> {{ analysisData.general_analysis.model_version }}
        </div>
      </div>
      
      <!-- Comments Details -->
      <div class="bg-white border border-colors-neutral-placeholder border-opacity-20 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-colors-primary">Comments Analysis Details</h2>
        
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
      
      <!-- Raw JSON Data (for development) -->
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
        class="mt-4 mx-auto w-fit flex-row-reverse"
        :to="$localePath('/analyze')"
      >
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
interface GeneralAnalysis {
  hate_speech_percentage: number
  hate_speech_count: number
  non_hate_speech_percentage: number
  non_hate_speech_count: number
  hate_speech_confidence_score: number
  non_hate_speech_confidence_score: number
  model_version: string
}

interface CommentDetail {
  originalComment: string
  platform: string
  date: string
  label: 'hate-speech' | 'non-hate-speech' | 'neutral'
  score: number
}

interface AnalysisData {
  general_analysis: GeneralAnalysis
  comments_details: CommentDetail[]
}

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const analysisData = ref<AnalysisData | null>(null)
const error = ref('')

onMounted(() => {
  // Get analysis data from query parameters
  if (route.query.data) {
    try {
      const data = JSON.parse(String(route.query.data))
      analysisData.value = data as AnalysisData
    } catch (err) {
      console.error('Error parsing analysis data:', err)
      error.value = 'Invalid analysis data received'
    }
  } else {
    error.value = 'No analysis data available'
  }
})
</script>