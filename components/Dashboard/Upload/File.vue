<template>
  <div class="w-fit max-lg:w-full">
    <div class="mb-4">{{ t('dashboard.steps.step2.descriptionFile') }}</div>

    <div class="flex gap-4 items-center flex-wrap">
      <UiButton @click="() => clickUpload()" variant="outline" class="max-lg:w-full">
        <label for="file-upload" class="cursor-pointer">
          {{
            !file
              ? t('dashboard.fileUpload.selectFile')
              : `${t('dashboard.fileUpload.selected')}: ${file.name}`
          }}
        </label>
        <template #icon>
          <IconUploadFile class="[&_path]:fill-current" />
        </template>
      </UiButton>

      <UiButton @click="downloadTemplate" variant="ghost" class="max-lg:w-full">
        {{ t('dashboard.fileUpload.downloadTempalte') }}
        <template #icon>
          <IconDownload class="[&_path]:fill-current" />
        </template>
      </UiButton>
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

  function clickUpload() {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    fileInput.click()
  }
</script>
