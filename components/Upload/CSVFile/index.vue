<template>
  <div class="my-5 grid grid-cols-none gap-5">
    <h6>{{ t('dashboard.fileUpload.header') }}:</h6>

    <div class="grid gap-2 lg:gap-y-0 grid-cols-1 lg:grid-cols-2">
      <label class="btn select-file" for="file-upload">{{
        !file
          ? t('dashboard.fileUpload.selectFile')
          : `${t('dashboard.fileUpload.selected')}: ${file.name}`
      }}</label>

      <button class="btn download-template" @click="downloadTemplate">
        {{ t('dashboard.fileUpload.downloadTempalte') }}
      </button>
    </div>
  </div>

  <input
    id="file-upload"
    hidden
    style="visibility: hidden"
    type="file"
    @change="updateFile"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { UploadRequestBody } from '../../../types'

  const { t } = useI18n()

  const emit = defineEmits(['update:data'])

  const file = ref<File>()

  function updateFile(ev: Event) {
    file.value = (ev.target as HTMLInputElement).files[0]
    updateData()
  }

  function updateData() {
    emit('update:data', {
      type: 'csv',
      data: {
        file: file.value,
      },
    } as unknown as UploadRequestBody)
  }

  function downloadTemplate() {
    const a = document.createElement('a')
    a.hidden = true
    a.href = '/logo.svg'
    a.download = 'template.csv'
    a.click()
  }
</script>

<style lang="postcss" scoped>
  .btn {
    @apply border-2 border-nuha-grey p-3 text-center italic rounded-xl text-nuha-grey bg-white;
  }
  download-template {
  }
  .select-file {
    @apply cursor-pointer;
  }
</style>
