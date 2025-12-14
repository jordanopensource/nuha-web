<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div>
        <div class="flex gap-2">
          <Icon name="mdi:help-circle-outline" class="text-colors-primary" size="24" />
          <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.textInput.structure') }}</h4>
        </div>
        <div class="bg-white border bg-opacity-20 p-4 mb-4 rounded-md text-sm">
          <p
            class="font-IBMPlexMono text-colors-neutral-foreground opacity-70 whitespace-pre-line"
          >
            {{ $t('analyze.help.textInput.sampleText', {dialect: dialectDisplay}) }}
          </p>
        </div>
      </div>
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.textInput.tips') }}</h4>
        <ul class="space-y-1 list-disc list-inside text-colors-neutral-foreground opacity-80">
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
  const match = supportedRegions.value.find(r => r.countryCode === code)
  return match?.dialectName?.[locale.value] || code
})

</script>
