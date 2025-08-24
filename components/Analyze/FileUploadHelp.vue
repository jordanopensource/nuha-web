<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.fileUpload.supportedTypes') }}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="file-type">
            <Icon name="mdi:file-document" size="24" class="icon" />
            <div>
              <div dir="ltr" class="file-ext">.txt</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.textFile') }}
              </div>
            </div>
          </div>
          <div class="file-type">
            <Icon name="mdi:file-excel" size="24" class="icon" />
            <div>
              <div dir="ltr" class="file-ext">.xls / xlsx</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.excelFile') }}
              </div>
            </div>
          </div>
          <div class="file-type">
            <Icon name="mdi:code-json" size="24" class="icon" />
            <div>
              <div dir="ltr" class="file-ext">.json</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.jsonFile') }}
              </div>
            </div>
          </div>
          <div class="file-type">
            <Icon name="mdi:file-table" size="24" class="icon" />
            <div>
              <div dir="ltr" class="file-ext">.csv</div>
              <div class="file-description">
                {{ $t('analyze.help.fileUpload.csvFile') }}
              </div>
            </div>
          </div>
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
<style lang="postcss" scoped>
.file-type {
  @apply flex items-center gap-3 p-3 rounded-lg bg-colors-primary-light bg-opacity-10;
  .icon {
    @apply text-colors-primary;
  }
  .file-ext {
    @apply font-medium rtl:text-end;
  }
  .file-description {
    @apply text-sm opacity-70;
  }
}
</style>
