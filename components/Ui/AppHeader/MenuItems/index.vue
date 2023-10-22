<template>
  <NuxtLink
    v-for="localeItem in availableLocales"
    :key="localeItem.code"
    :to="switchLocalePath(localeItem.code)"
    class="text-lg"
    :class="localeItem.code"
    @click="emit('showMobileMenu')"
    >{{ localeItem.name }}
  </NuxtLink>

  <template v-for="link in links">
    <NuxtLink
      v-if="link.condition === undefined || link.condition"
      @click="emit('showMobileMenu')"
      :to="link.path()"
      class="text-lg"
    >
      {{ link.title() }}
    </NuxtLink>
  </template>

  <!-- User items -->
  <UserMenuButton
    @click="emit('showMobileMenu')"
    @update:showItems="
      (value: boolean) => {
        showUserMenu = value
      }
    "
  />
</template>
<script setup lang="ts">
  import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

  const emit = defineEmits(['showMobileMenu'])
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
    title(): string
    path(): string
    condition?: boolean
  }

  const links = ref<Link[]>([
    {
      title: () => t('methodology.title'),
      path: () => localePath('/methodology'),
    },
    {
      title: () => t('header.userMenu.dashboard'),
      path: () => localePath('/dashboard'),
      condition: useAuthCheck()
    }
  ])
</script>
<style scoped lang="postcss"></style>
