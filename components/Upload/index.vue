<template>
  <div class="my-5">
    <div class="mb-8">
      <input
        class="hidden"
        type="radio"
        id="file-upload-tab"
        name="upload-mode"
        :checked="!commentModeSelected"
        @click="
          () => {
            commentModeSelected = false
            data.type = 'csv'
          }
        "
      />
      <label
        :class="
          'tab-entry ltr:rounded-l-xl rtl:rounded-r-xl ' +
          (!commentModeSelected ? 'selected-tab-entry' : '')
        "
        for="file-upload-tab"
        >{{ t('dashboard.tab.file') }}</label
      >
      <input
        class="hidden"
        type="radio"
        id="comment-insertion-tab"
        name="upload-mode"
        :checked="commentModeSelected"
        @click="
          () => {
            commentModeSelected = true
            data.type = 'comment'
          }
        "
      />
      <label
        :class="
          'tab-entry rtl:rounded-l-xl ltr:rounded-r-xl ' +
          (commentModeSelected ? 'selected-tab-entry' : '')
        "
        for="comment-insertion-tab"
        >{{ t('dashboard.tab.comment') }}</label
      >
    </div>

    <UploadCSVFile
      v-if="!commentModeSelected"
      @update:data="
        (_data: UploadRequestBody) => {
        data = _data
        }
      "
    />

    <UploadComment
      v-else
      @update:data="
        (_data: UploadRequestBody) => {
        data = _data
        }
      "
    />

    <button
      class="w-full border-2 rounded-xl bg-nuha-fushia-300 text-white text-2xl border-nuha-grey p-3 flex items-center justify-center"
      @click="handleSubmit"
    >
      <div v-if="!loading">
        {{ t('dashboard.submit') }}
      </div>
      <div v-else class="loader my-8"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { UploadRequestBody } from '../../types'
  import { get, set } from '@vueuse/core'
  import { ElNotification } from 'element-plus'

  const { t } = useI18n()
  const data = ref<UploadRequestBody>({
    type: 'csv',
    data: undefined as unknown as File,
  })
  const commentModeSelected = ref(false)
  const loading = ref(false)

  async function handleSubmit() {
    if (!get(data).data) {
      buildToast(
        'error',
        get(data)?.type === 'comment'
          ? t('status.commentCantBeEmpty')
          : t('status.selectAFileToUpload')
      )
      return
    }
    set(loading, true)
    switch (get(data)?.type) {
      case 'comment':
        await uploadComment()
        break
      case 'csv':
        await uploadFile()
        break
    }
    set(loading, false)
  }

  async function uploadFile() {
    const formData = new FormData()
    formData.append('file', get(data)?.data as File)
    await doRequest('/api/upload-file', formData)
  }

  async function uploadComment() {
    await doRequest('/api/upload-comment', JSON.stringify(get(data).data))
  }

  async function doRequest(endpoint: string, body: BodyInit) {
    await useFetch(endpoint, {
      method: 'POST',
      body: body,
    }).then((resp) => {
      if (get(resp.error)) {
        buildToast('error', get(resp.error)?.data as string)
        return
      }
      buildToast('success', t('status.uploadWasSuccessful'))
    })
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

<style lang="postcss" scoped>
  .tab-entry {
    @apply p-4 cursor-pointer bg-nuha-fushia-200 text-nuha-grey;
  }
  .selected-tab-entry {
    @apply bg-nuha-fushia-300 text-white font-bold;
  }
</style>
