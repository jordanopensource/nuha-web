<template>
  <NuxtLink
    v-for="localeItem in availableLocales"
    :key="localeItem.code"
    :to="switchLocalePath(localeItem.code)"
    :class="localeItem.code"
    @click="showMobileMenu = !showMobileMenu"
    >{{ localeItem.name }}
  </NuxtLink>

  <NuxtLink
    v-for="link in links"
    @click="showMobileMenu = !showMobileMenu"
    :to="link.path"
  >
    {{ link.title }}
  </NuxtLink>

  <!-- User items -->
  <UserMenuButton
    @click="showMobileMenu = !showMobileMenu"
    @update:showItems="(value: boolean) => {showUserMenu = value}"
  />
</template>
<script setup lang="ts">
  import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

  const localePath = useLocalePath()
  const { locale, locales, t } = useI18n()
  const showUserMenu = ref(false)

  const switchLocalePath = useSwitchLocalePath()
  const availableLocales = computed(() => {
    return (locales.value as LocaleObject[]).filter(
      (l: LocaleObject) => l.code !== locale.value
    )
  })

  type Link = {
    title: string
    path: string
  }

  const links = ref<Link[]>([
    {
      title: t('methodology.title'),
      path: localePath('/methodology'),
    },
  ])
</script>
<style scoped lang="postcss"></style>
