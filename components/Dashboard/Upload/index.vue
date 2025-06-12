<template>
  <section class="w-full my-5 lg:my-20" id="upload-container">
    <div class="flex flex-col items-top gap-4 my-8">
      <DashboardUploadStep
        circle-id="step-one"
        :order="1"
        :description="t('dashboard.steps.step1.name')"
      />
      <div class="text-2xl">
        <ol>
          <li
            v-for="item in t('dashboard.steps.step1.description').split('\n')"
          >
            {{ item }}
          </li>
        </ol>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <DashboardUploadStep
        circle-id="step-two"
        :order="2"
        :description="t('dashboard.steps.step2.name')"
      />
      <div class="analyze-container">
        <div class="flex max-lg:flex-col gap-8">
            <DashboardUploadSingleComment
              :key="dataFocus"
              @focus="
                () => {
                  dataFocus++
                  isSingleComment = true
                }
              "
              @update:data="
                (data: PredictionRequestBody) => {
                  requestBody = data
                }
              "
            />
  
          <div class="separator-container">
            <div class="separator"></div>
            <span class="font-bold text-base">{{ t('dashboard.or') }}</span>
            <div class="separator"></div>
          </div>
          <DashboardUploadFile
            :key="dataFocus"
            @focus="
              () => {
                dataFocus++
                isSingleComment = false
              }
            "
            @update:data="
              (data: PredictionRequestBody) => {
                requestBody = data
              }
            "
          />
        </div>

        <UiButton
          @click="handleSubmit"
          class="ms-auto max-lg:w-full"
          size="lg"
          :disabled="loading"
        >
          {{ t('dashboard.actions.analyze') }}
          <template #icon>
            <IconArrowForward class="rtl:rotate-180"/>
          </template>
        </UiButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ElNotification } from 'element-plus'

  const router = useRouter()
  const localePath = useLocalePath()
  const { t } = useI18n()

  const loading = ref(false)
  const isSingleComment = ref(false)
  const showData = ref(false)
  const dataFocus = ref(0) // HACK: this is used to reset the comment text field or file upload handler, when the other is selected
  const requestBody = ref<PredictionRequestBody>({
    type: 'comment',
    data: undefined as unknown as File,
  })
  const predictionData = ref<{
    chartData: PredictionMetrics
    originalData: PredictionResponse[]
  }>({
    chartData: {} as PredictionMetrics,
    originalData: [] as PredictionResponse[],
  })

  async function handleSubmit() {
    if (!requestBody.value.data) {
      buildToast(
        'error',
        requestBody.value?.type === 'comment'
          ? t('status.commentCantBeEmpty')
          : t('status.selectAFileToUpload'),
      )
      return
    }
    switch (requestBody.value?.type) {
      case 'comment':
        await uploadComment()
        break
      case 'csv':
        await uploadFile()
        break
    }
  }

  async function uploadFile() {
    const formData = new FormData()
    formData.append('file', requestBody.value?.data as File)
    await doRequest('/api/upload-file', formData)
  }

  async function uploadComment() {
    await doRequest(
      '/api/upload-comment',
      JSON.stringify(requestBody.value.data),
    )
  }

  async function doRequest(endpoint: string, body: BodyInit) {
    loading.value = true
    const { data, error } = await useFetch(endpoint, {
      method: 'POST',
      body: body,
    })

    if (error.value) {
      buildToast('error', t(error.value?.data as string))
      showData.value = false
      return
    }

    if (!data.value) {
      buildToast('error', t('status.stop'))
      showData.value = false
      return
    }

    const rawData = data.value.prediction as any
    rawData.originalData = rawData.originalData.map((p: any) => {
      p.label =
        p.label === 'hate-speech' ? t('data.hateSpeech') : t('data.neutral')
      return p
    })

    predictionData.value = rawData
    isSingleComment.value = endpoint === '/api/upload-comment'
    showData.value = true
    buildToast('success', t('status.uploadWasSuccessful'))

    useResultsData().updateResultsData({
      isSingleComment: isSingleComment.value,
      predictionData: predictionData.value,
      importedRows: !isSingleComment.value ? data.value.importedRows : 0,
      fileName: !isSingleComment.value ? data.value.fileName : '',
      originalComment: isSingleComment.value
        ? requestBody.value.data.comment
        : '',
    })
    loading.value = false
    router.push(localePath('/dashboard/results'))
  }

  function buildToast(type: 'success' | 'error', message: string) {
    ElNotification({
      title: type === 'success' ? t('status.success') : t('status.failed'),
      message: message,
      type: type,
      duration: 5000,
      position: 'bottom-right',
    })
  }
</script>

<style scoped lang="postcss">
  .separator-container {
    @apply h-48 w-0;
    @apply flex flex-col items-center justify-center gap-5;
    @apply max-lg:h-0 max-lg:w-full max-lg:flex-row;
  }
  .separator {
    @apply h-full border-l border-nuha-fushia-300;
    @apply max-lg:h-0 max-lg:border-b  max-lg:w-full;

  }
  .analyze-container {
    @apply flex flex-col gap-8 mx-auto;
    @apply p-8 border-nuha-fushia-200 border rounded-md shadow-lg;
    @apply w-3/4 mt-2 text-2xl max-lg:w-full max-lg:p-4;
  }
</style>
