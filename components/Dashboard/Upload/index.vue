<!-- WARN: you're gonna need some welding goggles before browsing this code, just saying... -->
<template>
  <section class="w-full my-5 lg:my-20" id="upload-container">
    <div class="flex items-top min-h-[150px]">
      <div class="w-1/4 inline-block">
        <DashboardUploadStep
          circle-id="step-one"
          :order="1"
          :description="t('dashboard.steps.step1.name')"
        />
      </div>
      <div class="w-3/4 inline-block mt-2">
        <ul>
          <li
            v-for="item in t('dashboard.steps.step1.description').split('\n')"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="flex items-top">
      <div class="w-1/4 inline-block">
        <DashboardUploadStep
          circle-id="step-two"
          :order="2"
          :description="t('dashboard.steps.step2.name')"
        />
      </div>
      <div class="w-3/4 inline-block mt-2">
        <div class="w-full mb-20">
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

          <button
            @click="handleSubmit"
            class="btn ltr:float-right rtl:float-left"
          >
            <div class="flex items-center" v-if="!loading">
              {{ t('dashboard.actions.analyze') }}
              <div class="arrow-icon"></div>
            </div>
            <div v-else class="loader my-8"></div>
          </button>
        </div>

        <div class="flex items-center gap-x-5">
          <div class="separator"></div>
          <span class="font-medium text-lg">{{ t('dashboard.or') }}</span>
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

        <button
          @click="handleSubmit"
          class="btn ltr:float-right rtl:float-left"
        >
          <div class="flex items-center" v-if="!loading">
            {{ t('dashboard.actions.analyze') }}
            <div class="arrow-icon"></div>
          </div>
          <div v-else class="loader my-8"></div>
        </button>
      </div>

      <!-- the mysterous line  -->
      <ClientOnly>
        <div
          class="hidden lg:block lg:absolute top-0 ltr:left-0 rtl:right-0 z-[-1]"
        >
          <svg
            :key="changeIndicator"
            :width="windowDimensions.width"
            :height="windowDimensions.height"
          >
            <line
              :x1="stepOneCoordinates.x.value"
              :y1="stepOneCoordinates.y.value"
              :x2="stepTwoCoordinates.x.value"
              :y2="stepTwoCoordinates.y.value"
              stroke="#e53076"
              stroke-dasharray="5,5"
            />
          </svg>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ElNotification } from 'element-plus'

  const router = useRouter()
  const localePath = useLocalePath()
  const { t } = useI18n()

  let stepOneCoordinates = { x: ref(0), y: ref(0) }
  let stepTwoCoordinates = { x: ref(0), y: ref(0) }
  const changeIndicator = ref(0)
  let windowDimensions = { width: 0, height: 0 }

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
    loading.value = false

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

    const rawData = data.value as any
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
    })
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

  function getElementCoodinates(id: string) {
    const el = document.getElementById(id)
    if (el === null) {
      return { x: ref(0), y: ref(0) }
    }
    const rect = el.getBoundingClientRect()
    return {
      x: ref(rect.x + rect.width / 2),
      y: ref(rect.y + rect.height / 2),
    }
  }

  function updateLineCoordinates() {
    /*
    Hi reader of this code,

    All JS developers have one thing in common, that is SUFERRING,
    in which it leads to hacking with the code, and that why I'm writing this,
    as you can see in the template the line takes its points coordinates from the given steps indicators elements,
    WHICH might and will change on resizes and locale changing,
    focus on the last one, because of the locale changing, the page has to reload,
    and there's no such event to detect that, so, as far as the line knows,
    the steps' elements never changed places (the huge shift from left to right),
    and to make that happen, a timer is needed to ONLY update the line's points' coordinates
    using the new and correct position, and 20ms is enough (i.e. not much noticable) to detect that (at least on my machine).

    Hope that cleared the confusion for you!

    PS: if the line's position doesn't update correctly, and that's what made you see this monstresity of a code,
    kindly open a PR with the new value, and mention your devices specs.

    Sincerely,
    Baraa Al-Masri
  */
    setTimeout(() => {
      stepOneCoordinates = getElementCoodinates('step-one')
      stepTwoCoordinates = getElementCoodinates('step-two')
      changeIndicator.value++
    }, 20)
  }

  function updateWindowDimensions() {
    windowDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  onMounted(() => {
    updateWindowDimensions()
    updateLineCoordinates()
    window.addEventListener('resize', () => {
      updateLineCoordinates()
      updateWindowDimensions()
    })
  })
</script>

<style scoped lang="postcss">
  .separator {
    @apply h-0 border-b border-b-nuha-fushia-300 w-full;
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
    @apply w-5 h-5 transform rtl:rotate-180 text-black;
    @apply bg-[url('/icons/arrow-right.svg')] bg-cover;
  }
</style>
