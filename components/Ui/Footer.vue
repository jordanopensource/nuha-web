<template>
  <div class="container flex justify-between border-y-2 p-8 my-4 mb-16 gap-4 border-nuha-fushia-300">
    <div class="flex max-md:flex-col gap-8 md:items-center">
      <NuxtLink :to="$nuxt.$localePath('/')">
        <img width="75" height="75" src="/logo.svg" alt="Nuha logo" />
      </NuxtLink>
      <div>
        <span class="text-xl font-light">Nuha نهى</span>
        <p class="text-nuha-grey-100">{{ $t('footer.copyright') }}</p>
      </div>
    </div>
    <nav class="flex max-md:flex-col gap-1 md:gap-4 justify-center">
      <NuxtLink
        v-for="(link, i) in links"
        :key="i"
        class="link link-nav link-hover !text-sm max-md:min-w-max"
        :to="link.path"
        :external="link.external"
        :target="link.external ? '_blank' : '_self'"
        >{{ link.title() }}</NuxtLink
      >
    </nav>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()
  const localePath = useLocalePath()
  type Link = {
    title(): string
    path: string
    external?: boolean
  }
  const links = <Link[]>([
    {
      path: localePath('/'),
      title: () => t('footer.links.about'),
    },
    {
      path: localePath('/'),
      title: () => t('footer.links.terms'),
    },
    {
      path: localePath('/'),
      title: () => t('footer.links.privacy'),
    },
    {
      path: 'https://github.com/jordanopensource/nuha-web',
      title: () => t('footer.links.github'),
      external: true,
    },
  ])
</script>

<style scoped lang="postcss"></style>
