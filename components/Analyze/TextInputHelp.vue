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
          <h4 class="mb-2 font-IBMPlexSansArabic text-base">
            {{ $t('analyze.help.textInput.structure') }}
          </h4>
        </div>
        <div class="mb-4 rounded-md border bg-white bg-opacity-20 p-4 text-sm">
          <p
            class="whitespace-pre-line font-IBMPlexMono text-colors-neutral-foreground opacity-70"
          >
            {{
              $t('analyze.help.textInput.sampleText', {
                dialect: dialectDisplay,
              })
            }}
          </p>
        </div>
      </div>
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">
          {{ $t('analyze.help.textInput.tips') }}
        </h4>
        <ul
          class="list-inside list-disc space-y-1 text-colors-neutral-foreground opacity-80"
        >
          <li>{{ $t('analyze.help.textInput.tip1') }}</li>
          <li>{{ $t('analyze.help.textInput.tip2') }}</li>
          <li>{{ $t('analyze.help.textInput.tip3') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { region, supportedRegions } = useGeolocation()
  const { locale } = useI18n()

  const dialectDisplay = computed(() => {
    const code = region.value?.countryCode
    const match = supportedRegions.value.find((r) => r.countryCode === code)
    return match?.dialectName?.[locale.value] || code
  })
</script>
