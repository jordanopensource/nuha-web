<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div>
        <div class="flex gap-2">
          <Icon
            name="mdi:help-circle-outline"
            class="text-colors-primary"
            size="24"
          />
          <div>
            <h4 class="mb-2 font-IBMPlexSansArabic text-base">
              {{ $t('analyze.help.fileUpload.supportedTypes') }}
            </h4>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <UiButton
            variant="outline"
            class="file-type file-type--highlighted !bg-colors-primary-light !bg-opacity-100 !text-colors-neutral-foreground [&_.icon]:!text-colors-neutral-foreground"
            :title="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'Excel',
              })
            "
            :aria-label="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'Excel',
              })
            "
            @click="downloadTemplate('xlsx')"
          >
            <div class="flex w-full items-center gap-3">
              <Icon name="mdi:file-excel" size="28" class="icon shrink-0" />
              <div class="flex-1 text-start">
                <div dir="ltr" class="file-ext">.xls / xlsx</div>
                <div class="file-description">
                  {{ $t('analyze.help.fileUpload.excelFile') }}
                </div>
                <div
                  class="file-description flex items-center gap-1 !opacity-100"
                >
                  <Icon name="mdi:star" size="18" class="shrink-0" />
                  {{ $t('analyze.help.fileUpload.excelHint') }}
                </div>
              </div>
            </div>
            <span class="download-action">
              <Icon name="mdi:download" size="18" class="shrink-0" />
              {{ $t('analyze.help.fileUpload.downloadLabel') }}
            </span>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            :title="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'TXT',
              })
            "
            :aria-label="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'TXT',
              })
            "
            @click="downloadTemplate('txt')"
          >
            <div class="flex w-full items-center gap-3">
              <Icon name="mdi:file-document" size="28" class="icon shrink-0" />
              <div class="flex-1 text-start">
                <div dir="ltr" class="file-ext">.txt</div>
                <div class="file-description">
                  {{ $t('analyze.help.fileUpload.textFile') }}
                </div>
              </div>
            </div>
            <span class="download-action">
              <Icon name="mdi:download" size="18" class="shrink-0" />
              {{ $t('analyze.help.fileUpload.downloadLabel') }}
            </span>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            :title="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'JSON',
              })
            "
            :aria-label="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'JSON',
              })
            "
            @click="downloadTemplate('json')"
          >
            <div class="flex w-full items-center gap-3">
              <Icon name="mdi:code-json" size="28" class="icon shrink-0" />
              <div class="flex-1 text-start">
                <div dir="ltr" class="file-ext">.json</div>
                <div class="file-description">
                  {{ $t('analyze.help.fileUpload.jsonFile') }}
                </div>
              </div>
            </div>
            <span class="download-action">
              <Icon name="mdi:download" size="18" class="shrink-0" />
              {{ $t('analyze.help.fileUpload.downloadLabel') }}
            </span>
          </UiButton>

          <UiButton
            variant="ghost"
            class="file-type"
            :title="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'CSV',
              })
            "
            :aria-label="
              $t('analyze.help.fileUpload.downloadTemplate', {
                fileType: 'CSV',
              })
            "
            @click="downloadTemplate('csv')"
          >
            <div class="flex w-full items-center gap-3">
              <Icon name="mdi:file-table" size="28" class="icon shrink-0" />
              <div class="flex-1 text-start">
                <div dir="ltr" class="file-ext">.csv</div>
                <div class="file-description">
                  {{ $t('analyze.help.fileUpload.csvFile') }}
                </div>
                <div class="file-description flex items-start gap-1">
                  <Icon
                    name="mdi:alert-outline"
                    size="18"
                    class="mt-0.5 shrink-0 text-amber-700"
                  />
                  {{ $t('analyze.help.fileUpload.csvWarning') }}
                </div>
              </div>
            </div>
            <span class="download-action">
              <Icon name="mdi:download" size="18" class="shrink-0" />
              {{ $t('analyze.help.fileUpload.downloadLabel') }}
            </span>
          </UiButton>
        </div>
      </div>
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">
          {{ $t('analyze.help.fileUpload.requirements') }}
        </h4>
        <ul
          class="list-inside list-disc space-y-1 text-colors-neutral-foreground opacity-80"
        >
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
    @apply flex h-full flex-col items-stretch justify-start gap-3 rounded-lg border p-3;
    @apply cursor-pointer transition-all duration-200;
    @apply hover:border-colors-primary;

    .icon {
      @apply text-colors-primary;
    }
    .file-ext {
      @apply font-medium rtl:text-end;
    }
    .file-description {
      @apply text-sm opacity-70;
    }

    .download-action {
      @apply mt-auto flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5;
      @apply border border-colors-neutral-foreground border-opacity-20;
      @apply text-sm font-normal text-colors-neutral-foreground opacity-80;
      @apply transition-all duration-200;
    }
    &:hover .download-action {
      @apply border-opacity-40 opacity-100;
    }

    &.file-type--highlighted .download-action {
      @apply border-colors-primary border-opacity-40 text-colors-primary opacity-100;
    }
    &.file-type--highlighted:hover .download-action {
      @apply border-opacity-100;
    }
  }
</style>
