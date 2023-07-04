<template>
  <h6>{{ t('dashboard.fileUpload.header') }}:</h6>
  <div class="grid gap-2 lg:gap-y-0 grid-cols-1 lg:grid-cols-2">
    <label class="inline" for="file-upload">{{
      t('dashboard.fileUpload.selectFile')
    }}</label>
    <button class="btn download-template" @click="downloadTemplate">
      {{ t('dashboard.fileUpload.downloadTempalte') }}
    </button>
  </div>
  <input
    id="file-upload"
    hidden
    style="visibility: hidden"
    class="btn select-file"
    type="file"
    @change="updateFile"
  />
</template>

<script setup lang="ts">
  import RequestBody from '../RequestBody'

  const { t } = useI18n()

  const emit = defineEmits(['update:data'])

  let file: File

  function updateFile(ev: Event) {
    file = (ev.target as HTMLInputElement).files[0]
    updateData()
  }

  function updateData() {
    emit('update:data', {
      type: 'csv',
      data: {
        file: file,
      },
    } as RequestBody)
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
    @apply border border-nuha-fushia-200;

    &-download-template {
    }

    &-select-file {
    }
  }
</style>
