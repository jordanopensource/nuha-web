<template>
  <div>
    <!-- Trigger Button -->
    <UiButton
      variant="ghost"
      class="max-lg:w-full"
      :class="$attrs.class"
      :size="size"
      @click="showModal = true"
    >
      <template #icon>
        <Icon name="mdi:earth" size="20" />
      </template>
      {{ currentSelectionText }}
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
                <div class="font-medium font-IBMPlexSansArabic">{{ l.nativeName }}</div>
                <small>{{ l.name }}</small>
              </div>
            </UiButton>
          </div>
        </div>

        <!-- Region Selection -->
        <div v-if="mode === 'both' || mode === 'region'">
          <h3 class="text-lg font-medium text-colors-neutral-foreground font-IBMPlexSansArabic mb-4">
            {{ $t('settings.regionLanguage.region') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
            <UiButton
              v-for="r in supportedRegions"
              :key="r.countryCode"
              variant="ghost"
              size="lg"
              class="!grid border region-btn"
              :class="{
              'border-colors-primary bg-colors-primary-light bg-opacity-20': region?.countryCode === r.countryCode,
              'border-colors-neutral-foreground border-opacity-20': region?.countryCode !== r.countryCode
              }"
              @click="updateRegion(r.countryCode)"
            >
              <template #icon>
                <Icon class="col-start-1 row-start-1" :name="`flag:${r.countryCode}-4x3`" size="20" />
              </template>
              <div class="text-left col-start-2">
                <div class="font-medium font-IBMPlexSansArabic">{{ $t(`region.${r.countryCode?.toLowerCase()}`) }}</div>
              </div>
            </UiButton>
          </div>
        </div>

        <!-- Current Detection Info -->
         <!-- FIXME: make it actually make a call to detect the language
                     rather than getting it from the cached value -->
        <div
          v-if="region?.country && (mode === 'region' || mode === 'both')"
          class="p-4 rounded-lg bg-colors-primary-light bg-opacity-10"
        >
          <div class="flex items-center gap-2 mb-2">
            <Icon name="mdi:map-marker" size="16" />
            <span class="text-sm font-medium">{{ $t('settings.regionLanguage.detectedLocation') }}</span>
          </div>
          <small class="ms-6">
            {{ region.city ? `${region.city}, ` : ''}}{{ region.country }}
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
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  mode: 'both',
  title: undefined
})

const { locale, locales, setLocale, t } = useI18n()
const { region, supportedRegions, setRegion } = useGeolocation()

const showModal = ref(false)

// Available locales with metadata
const availableLocales = computed(() => {
  return (locales.value || []).map(l => ({
    code: l.code,
    name: l.name,
    nativeName: l.name,
    dir: l.dir
  })).filter(Boolean)
})

const languageName = ref<string>('')
const regionName = ref<string>('')

// Watch for changes in language or region and update button name accordingly
watch([locale, region], () => {
  console.info("triggered!!!")
  if (region.value?.countryCode) {
    regionName.value = t(`region.${region.value.countryCode.toLowerCase()}`)
  } else {
    regionName.value = ''
  }
  if (locale.value) {
    languageName.value = availableLocales.value.find(l => l.code === locale.value)?.name || locale.value.toUpperCase()
  } else {
    languageName.value = ''
  }
}, { immediate: true })



// Current selection text for button text
const currentSelectionText = computed(() => {
  if (props.mode === 'language') {
    return languageName.value
  } else if (props.mode === 'region') {
    return regionName.value
  } else {
    return `${languageName.value}${regionName.value ? ' • ' + regionName.value : ''}`
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
      const newRegion = supportedRegions.find(r => r.countryCode === reg)
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