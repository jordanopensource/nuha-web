<template>
  <div>
    <!-- Trigger Button -->
    <UiButton
      variant="ghost"
      class="max-lg:w-full"
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
      :title="$t('settings.regionLanguage.title')"
      :action-button-text="$t('settings.regionLanguage.apply')"
      :cancel-button-text="$t('misc.cancel')"
      size="lg"
      @action="applyChanges"
      @close="resetSelections"
    >
      <div class="space-y-6">
        <!-- Language Selection -->
        <div>
          <h3 class="text-lg font-medium text-colors-neutral-foreground font-IBMPlexSansArabic mb-4">
            {{ $t('settings.regionLanguage.language') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              class="flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-colors-primary-light hover:bg-opacity-40"
              :class="{
                'border-colors-primary bg-colors-primary-light bg-opacity-20': selectedLanguage === locale.code,
                'border-colors-neutral-foreground border-opacity-20': selectedLanguage !== locale.code
              }"
              @click="selectedLanguage = locale.code"
            >
              <!-- <div class="flex-shrink-0">
                <Icon :name="locale.flag" size="24" />
              </div> -->
              <div :class="locale.dir === 'rtl' ? 'text-right ms-auto' : 'text-left'">
                <div class="font-medium font-IBMPlexSansArabic">{{ locale.name }}</div>
                <small>{{ locale.nativeName }}</small>
              </div>
            </button>
          </div>
        </div>

        <!-- Region Selection -->
        <div>
          <h3 class="text-lg font-medium text-colors-neutral-foreground font-IBMPlexSansArabic mb-4">
            {{ $t('settings.regionLanguage.region') }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="region in supportedRegions"
              :key="region.code"
              class="flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-colors-primary-light hover:bg-opacity-40"
              :class="{
                'border-colors-primary bg-colors-primary-light bg-opacity-20': selectedRegion === region.code,
                'border-colors-neutral-foreground border-opacity-20': selectedRegion !== region.code
              }"
              @click="selectedRegion = region.code"
            >
              <div class="flex-shrink-0">
                <Icon :name="`flag:${region.code}-4x3`" size="24" />
              </div>
              <div class="text-left">
                <div class="font-medium font-IBMPlexSansArabic">{{ region.name }}</div>
                <div class="text-sm text-colors-neutral-foreground opacity-70">{{ region.aiModel }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Current Detection Info -->
         <!-- FIXME: make it actually make a call to detect the language
                     rather than getting it from the cached value -->
        <div
          v-if="region?.country"
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
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})

// Composables
const { locale, locales, setLocale } = useI18n()
// const { t } = useI18n()
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
  const currentRegion = supportedRegions.find(r => r.code === region.value?.countryCode?.toLowerCase())
  
  const languageName = currentLocale?.name || locale.value.toUpperCase()
  const regionName = currentRegion?.name || region.value?.country || 'Unknown'
  
  return `${languageName} • ${regionName}`
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