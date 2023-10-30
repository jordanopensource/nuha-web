<template>
  <div class="flex flex-col gap-6">
    <p class="leading-none">{{ t('dashboard.steps.step2.descriptionFile') }}</p>

    <div class="flex gap-4 items-center flex-wrap">
      <label class="btn select-file" for="file-upload"
        >{{
          !file
            ? t('dashboard.fileUpload.selectFile')
            : `${t('dashboard.fileUpload.selected')}: ${file.name}`
        }}
        <span class="mt-1 ms-1 rtl:rotate-180">￫</span>
      </label>

      <button @click="downloadTemplate" class="btn">
        {{ t('dashboard.fileUpload.downloadTempalte') }}
        <span class="mt-1 ms-1 rtl:rotate-180">￫</span>
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
    @apply border p-3 flex items-center justify-center text-lg max-h-9;
    @apply border-nuha-fushia-300;
    @apply text-nuha-fushia-300 font-IBMPlexSansArabic;
    @apply hover:bg-nuha-fushia-200;
  }
  .select-file {
    @apply cursor-pointer;
    @apply !bg-nuha-fushia-300 text-nuha-white;
    @apply hover:!bg-nuha-fushia-200 hover:!text-nuha-fushia-300;
  }
</style>
