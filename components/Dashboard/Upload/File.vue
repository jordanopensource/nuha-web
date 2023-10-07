<template>
  <div class="my-5 grid grid-cols-none gap-5">
    <p>{{ t('dashboard.steps.step2.descriptionFile') }}</p>

    <div class="grid gap-2 lg:gap-y-0 grid-cols-1 lg:grid-cols-2">
      <label class="btn select-file" for="file-upload">{{
        !file
          ? t('dashboard.fileUpload.selectFile')
          : `${t('dashboard.fileUpload.selected')}: ${file.name}`
      }}</label>

      <button class="btn" @click="downloadTemplate">
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
  const { t } = useI18n()

  const emit = defineEmits(['update:data'])

  const file = ref<File>()

  function updateFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files === null || files.length === 0) {
      return
    }
    file.value = files[0]
    updateData()
  }

  function updateData() {
    emit('update:data', {
      type: 'csv',
      data: file.value,
    } as PredictionRequestBody)
  }

  function downloadTemplate() {
    const a = document.createElement('a')
    a.hidden = true
    a.href = '/comments-sheet-template.csv'
    a.download = 'template.csv'
    a.click()
  }
</script>

<style lang="postcss" scoped>
  .btn {
    @apply border-2 border-nuha-grey p-3 text-center italic rounded-xl text-nuha-grey bg-white;
  }

  .select-file {
    @apply cursor-pointer;
  }
</style>
