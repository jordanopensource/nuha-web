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
     <!-- TODO: make it instantly switch language once selected -->
    <UiModal
      v-model="showModal"
      :title="title || $t('settings.regionLanguage.title')"
      :action-button-text="$t('settings.regionLanguage.apply')"
      :cancel-button-text="$t('misc.cancel')"
      size="lg"
      @action="applyChanges"
      @close="resetSelections"
      @cancel="resetSelections"
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
                'border-colors-primary bg-colors-primary-light bg-opacity-20': selectedLanguage === l.code,
                'border-colors-neutral-foreground border-opacity-20': selectedLanguage !== l.code
              }"
              @click="selectedLanguage = l.code"
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
              :key="r.code"
              variant="ghost"
              size="lg"
              class="!grid border region-btn"
              :class="{
                'border-colors-primary bg-colors-primary-light bg-opacity-20': selectedRegion === r.code,
                'border-colors-neutral-foreground border-opacity-20': selectedRegion !== r.code
              }"
              @click="selectedRegion = r.code"
            >
              <template #icon>
                <Icon class="col-start-1 row-start-1" :name="`flag:${r.code}-4x3`" size="20" />
              </template>
              <div class="text-left col-start-2">
                <div class="font-medium font-IBMPlexSansArabic">{{ $t(`region.${r.name?.toLowerCase()}`) }}</div>
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

// Composables
const { locale, locales, setLocale, t } = useI18n()
const { region, supportedRegions, setRegion } = useGeolocation()

// Modal state
const showModal = ref(false)

// Selection state
const selectedLanguage = ref(locale.value)
const selectedRegion = ref(region.value?.countryCode?.toLowerCase() || '')

// Available locales with metadata
const availableLocales = computed(() => {
  return (locales.value || []).map(l => ({
    code: l.code,
    name: l.name,
    nativeName: l.name,
    dir: l.dir
  })).filter(Boolean)
})

// Current selection text for button
const currentSelectionText = computed(() => {
  const currentLocale = availableLocales.value.find(l => l.code === locale.value)
  const languageName = currentLocale?.name || locale.value.toUpperCase()
  const regionName = region.value?.country ?
    currentLocale?.code === 'en' ?
      region.value.countryCode?.toLocaleUpperCase() :
      t(`region.${region.value.country?.toLowerCase()}`) :
    'Unknown'
  
  if (props.mode === 'language') {
    return languageName
  } else if (props.mode === 'region') {
    return regionName
  } else {
    return `${languageName} • ${regionName}`
  }
})

// Methods
const applyChanges = async () => {
  try {
    // Update language
    if (selectedLanguage.value !== locale.value) {
      await setLocale(selectedLanguage.value)
    }
    
    // Update region
    if (selectedRegion.value && selectedRegion.value !== region.value?.countryCode?.toLowerCase()) {
      const newRegion = supportedRegions.find(r => r.code === selectedRegion.value)
      if (newRegion) {
        setRegion({
          status: 'success',
          countryCode: newRegion.code.toUpperCase(),
          country: newRegion.name
        })
      }
    }
    
    showModal.value = false
  } catch (error) {
    console.error('Error applying region/language changes:', error)
  }
}

const resetSelections = () => {
  selectedLanguage.value = locale.value
  selectedRegion.value = region.value?.countryCode?.toLowerCase() || ''
}

// Watch for external changes
watch([locale, region], () => {
  selectedLanguage.value = locale.value
  selectedRegion.value = region.value?.countryCode?.toLowerCase() || ''
})

// Initialize selections
onMounted(() => {
  resetSelections()
})
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