<!-- FIXME: region not set on first load -->
<template>
  <div>
    <!-- Trigger Button -->
    <UiButton
      :variant="buttonVariant"
      class="lang-btn max-lg:w-full"
      :class="$attrs.class"
      :size="size"
      @click="showModal = true"
    >
      <template v-if="buttonContent !== 'text'" #icon>
        <Icon v-if="showFlagInButton && currentRegionFlag" :name="currentRegionFlag" size="20" />
        <Icon v-else name="mdi:earth" size="20" />
      </template>
      <span v-if="buttonContent !== 'icon'">
        {{ currentSelectionText }}
      </span>
    </UiButton>

    <!-- Modal -->
    <UiModal
      v-model="showModal"
      :title="title || $t('settings.regionLanguage.title')"
      :action-button-text="$t('settings.regionLanguage.apply')"
      :cancel-button-text="$t('misc.cancel')"
      size="lg"
      :show-footer="false"
    >
      <div class="space-y-6">
        <!-- Language Selection -->
        <div v-if="mode === 'both' || mode === 'language'">
          <h3 class="text-lg font-medium text-colors-neutral-foreground font-IBMPlexSansArabic mb-4">
            {{ $t('settings.regionLanguage.language') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
            <UiButton
              v-for="l in availableLocales"
              :key="l.code"
              variant="ghost"
              size="lg"
              class="border"
              :class="{
                'border-colors-primary bg-colors-primary-light bg-opacity-20': locale === l.code,
                'border-colors-neutral-foreground border-opacity-20': locale !== l.code
              }"
              @click="updateLang(l.code)"
            >
              <div :class="l.dir === 'rtl' ? 'text-right' : 'text-left'">
                <div class="font-medium font-IBMPlexSansArabic">
                    {{ l.nativeName }}
                </div>
                <small>{{ l.name }}</small>
              </div>
            </UiButton>
          </div>
        </div>

        <!-- Region Selection -->
        <!-- TODO: add a note explaining what region is used for -->
        <div v-if="mode === 'both' || mode === 'region'">
          <h3 class="text-lg font-medium text-colors-neutral-foreground font-IBMPlexSansArabic mb-4">
            {{ $t('settings.regionLanguage.region') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
            <template
              v-for="r in supportedRegions"
              :key="r.countryCode"
            >
              <UiButton
                v-if="r.dialectName && r.dialectName[locale]"
                variant="ghost"
                size="lg"
                class="!grid border region-btn border-colors-neutral-foreground border-opacity-20"
                :class="{
                '!border-colors-primary !bg-colors-primary-light !bg-opacity-80': region?.countryCode === r.countryCode || detectedRegion?.countryCode === r.countryCode,
                '!bg-colors-primary-light !bg-opacity-10 !border-opacity-10 opacity-60': !r.isAvailable,
                }"
                :disabled="!r.isAvailable"
                @click="updateRegion(r.countryCode)"
              >
                <template v-if="r.flagIcon" #icon>
                  <Icon class="col-start-1 row-start-1" :name="r.flagIcon" size="20" />
                </template>
                <div class="text-left col-start-2">
                  <div class="font-medium font-IBMPlexSansArabic">
                    {{ r.dialectName[locale] }}
                  </div>
                </div>
              </UiButton>
            </template>
          </div>
        </div>
        <!-- Detected region -->
        <div
          v-if="detectedRegion?.countryCode && (mode === 'region' || mode === 'both')"
          class="p-4 rounded-lg bg-colors-primary-light bg-opacity-10"
        >
          <div class="flex items-center gap-2 mb-2">
            <Icon name="mdi:map-marker" size="16" />
            <span class="text-sm font-medium">{{ $t('settings.regionLanguage.detectedLocation') }}</span>
          </div>
          <small class="ms-6">
            {{ detectedRegion.city ? `${detectedRegion.city}, ` : ''}}{{ detectedRegion?.countryCode }}
          </small>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from 'vue-i18n'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /**
   * Controls which selectors to show
   * @default 'both'
   */
  mode?: 'language' | 'region' | 'both'
  
  /**
   * Controls the modal title
   */
  title?: string
  buttonVariant?: 'primary' | 'outline' | 'ghost'
  
  /**
   * Controls whether to show flag in the button title instead of region name
   * @default false
   */
  showFlagInButton?: boolean
  
  /**
   * Controls what to show in the button
   * @default 'both'
   */
  buttonContent?: 'icon' | 'text' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  mode: 'both',
  title: undefined,
  buttonVariant: 'outline',
  showFlagInButton: false,
  buttonContent: 'both'
})

const { locale, locales, setLocale } = useI18n()
const { region, supportedRegions, setRegion, detectedRegion } = useGeolocation()

const showModal = ref(false)

// Available locales with metadata
const availableLocales = computed(() => {
  return (locales.value || []).map(l => {
    return {
      code: l.code,
      name: l.name,
      dir: l.dir,
      nativeName: l.nativeName // Native name from i18n custom config
    }
  }).filter(Boolean)
})

const languageName = ref<string>('')
const regionName = ref<string>('')

// Watch for changes in language or region and update button name accordingly
watch([locale, region, detectedRegion], () => {
  if (region.value?.countryCode && region.value.dialectName) {
    regionName.value = region.value.dialectName[locale.value]
  } else {
    regionName.value = ''
  }
  if (locale.value) {
    languageName.value =
      availableLocales.value.find(l => l.code === locale.value)?.nativeName as string
      || locale.value.toUpperCase()
  } else {
    languageName.value = ''
  }
}, { immediate: true })

// Current region flag for button
const currentRegionFlag = computed(() => region.value?.flagIcon || null)

// Current selection text for button text
const currentSelectionText = computed(() => {
  if (props.mode === 'language') {
    return languageName.value
  } else if (props.mode === 'region') {
    // If showFlagInButton is true and we have a flag, don't show region name as it's shown as icon
    return props.showFlagInButton && currentRegionFlag.value && props.buttonContent === 'icon' ? ''
      : regionName.value || detectedRegion?.value?.countryCode || "Select AI dialect" // TODO: i18n
  } else {
    const langText = languageName.value
    const regText = props.showFlagInButton && currentRegionFlag.value ? '' : regionName.value
    return regText ? `${langText} • ${regText}` : langText
  }
})

const updateLang = async (lang: Locale) => {
  try {
    if (lang && lang !== locale.value) {
      await setLocale(lang)
    }
  } catch (err) {
    console.error("Error applying language: ", err)
  }
  if (props.mode !== 'both')
    showModal.value = false
}

const updateRegion = async (reg: string) => {
  try {
    if (reg && reg !== region.value?.countryCode?.toLowerCase()) {
      const newRegion = supportedRegions.value.find(r => r.countryCode === reg)
      if (newRegion) {
        setRegion(newRegion)
      }
    }
  } catch (err) {
    console.error("Error applying region: ", err)
  }
  if (props.mode !== 'both')
    showModal.value = false
}
</script>

<style lang="postcss" scoped>
.region-btn {
  grid-template-columns: repeat(2, minmax(0, 8%));
}

@media (max-width: 768px) {
  .region-btn {
    grid-template-columns: repeat(2, minmax(0, 15%));
  }
}

</style>