<template>
  <UiButton
    v-for="localeItem in availableLocales"
    :key="localeItem.code"
    :to="switchLocalePath(localeItem.code)"
    class="!text-nuha-grey"
    :class="localeItem.code"
    @click="emit('showMobileMenu')"
    variant="ghost"
    >{{ localeItem.name }}
  </UiButton>

  <template v-for="link in links">
    <UiButton
      v-if="link.condition === undefined || link.condition"
      @click="emit('showMobileMenu')"
      :to="link.path()"
      :variant="link.path() === localePath('/dashboard') ? 'outline' : 'ghost'"
      class="!text-nuha-grey"
    >
      {{ link.title() }}
    </UiButton>
  </template>

  <!-- User items -->
  <UserMenuButton
    @click="emit('showMobileMenu')"
    @show-mobile-menu="emit('showMobileMenu')"
    @update:showItems="
      (value: boolean) => {
        showUserMenu = value
      }
    "
  />
</template>
<script setup lang="ts">
  const emit = defineEmits(['showMobileMenu'])
  const localePath = useLocalePath()
  const { locale, locales, t } = useI18n()
  const showUserMenu = ref(false)

  const switchLocalePath = useSwitchLocalePath()
  const availableLocales = computed(() => {
    return (locales.value as any[]).filter((l: any) => l.code !== locale.value)
  })

  type Link = {
    title(): string
    path(): string
    condition?: boolean
  }

  const links = ref<Link[]>([
    {
      title: () => t('methodology.title'),
      path: () => localePath('/methodology'),
    },
    //   {
    //     title: () => t('findings.title'),
    //     path: () => localePath('/findings'),
    //   },
    {
      title: () => t('header.userMenu.dashboard'),
      path: () => localePath('/dashboard'),
      condition: useAuthCheck(),
    },
  ])
</script>
<style scoped lang="postcss"></style>
