<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div>
        <div class="flex gap-2">
          <Icon name="mdi:help-circle-outline" class="text-colors-primary" size="24" />
          <div>
            <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.fileUpload.supportedTypes') }}</h4>
            <small>
              {{ $t('analyze.help.fileUpload.clickToDownload') }}
            </small>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <UiButton
            variant="ghost"
            class="file-type"
            @click="downloadTemplate('csv')"
          >
            <template #icon>
              <Icon name="mdi:file-table" size="28" class="icon" />
            </template>
            <div class="flex-1 text-start">
              <div dir="ltr" class="file-ext">.csv</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.csvFile') }}
              </div>
            </div>
            <div class="download-overlay">
              <Icon name="mdi:download" size="20" />
              <span>{{ $t('analyze.help.fileUpload.downloadTemplate', { fileType: 'CSV' }) }}</span>
            </div>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            @click="downloadTemplate('xlsx')"
          >
            <template #icon>
              <Icon name="mdi:file-excel" size="28" class="icon" />
            </template>
            <div class="flex-1 text-start">
              <div dir="ltr" class="file-ext">.xls / xlsx</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.excelFile') }}
              </div>
            </div>
            <div class="download-overlay">
              <Icon name="mdi:download" size="20" />
              <span>{{ $t('analyze.help.fileUpload.downloadTemplate', { fileType: 'Excel' }) }}</span>
            </div>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            @click="downloadTemplate('json')"
          >
            <template #icon>
              <Icon name="mdi:code-json" size="28" class="icon" />
            </template>
            <div class="flex-1 text-start">
              <div dir="ltr" class="file-ext">.json</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.jsonFile') }}
              </div>
            </div>
            <div class="download-overlay">
              <Icon name="mdi:download" size="20" />
              <span>{{ $t('analyze.help.fileUpload.downloadTemplate', { fileType: 'JSON' }) }}</span>
            </div>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            @click="downloadTemplate('txt')"
          >
            <template #icon>
              <Icon name="mdi:file-document" size="28" class="icon" />
            </template>
            <div class="flex-1 text-start">
              <div dir="ltr" class="file-ext">.txt</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.textFile') }}
              </div>
            </div>
            <div class="download-overlay">
              <Icon name="mdi:download" size="20" />
              <span>{{ $t('analyze.help.fileUpload.downloadTemplate', { fileType: 'TXT' }) }}</span>
            </div>
          </UiButton>
        </div>
      </div>
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.fileUpload.requirements') }}</h4>
        <ul class="space-y-1 list-disc list-inside text-colors-neutral-foreground opacity-80">
          <li>{{ $t('analyze.help.fileUpload.maxSize') }}</li>
          <li>{{ $t('analyze.help.fileUpload.encoding') }}</li>
          <li>{{ $t('analyze.help.fileUpload.content') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const downloadTemplate = (fileType: string) => {
  const templateUrl = `/input-templates/template.${fileType}`
  const link = document.createElement('a')
  link.href = templateUrl
  link.download = `template.${fileType}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style lang="postcss" scoped>
.file-type {
  @apply relative flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10 border overflow-hidden transition-all duration-200;
  @apply hover:bg-colors-primary-light hover:bg-opacity-20 cursor-pointer;
  
  .icon {
    @apply text-colors-primary;
  }
  .file-ext {
    @apply font-medium rtl:text-end;
  }
  .file-description {
    @apply text-sm opacity-70;
  }
  
  .download-overlay {
    @apply absolute inset-0 bg-colors-primary bg-opacity-100 flex items-center justify-center gap-2 text-white font-medium text-sm;
    @apply opacity-0 transition-opacity duration-200 pointer-events-none;
  }
  
  &:hover .download-overlay {
    @apply opacity-100;
  }
}
</style>
