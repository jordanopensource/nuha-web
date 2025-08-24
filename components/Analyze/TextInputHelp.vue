<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <div>
        <h4 class="mb-2 font-IBMPlexSansArabic text-base">{{ $t('analyze.help.textInput.structure') }}</h4>
        <div class="bg-white border bg-opacity-20 p-4 mx-2 mb-4 rounded-md text-sm">
          <p
            class="font-IBMPlexMono text-colors-neutral-foreground opacity-70 whitespace-pre-line"
          >
            {{ $t('analyze.help.textInput.sampleText') }}
          </p>
        </div>
        <p>{{ $t('analyze.help.textInput.structure-subtitle') }}</p>
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
