<template>
  <footer class="container">
    <div
      class="flex justify-between gap-x-8 border-y-2 py-16 my-4 mb-16 border-nuha-fushia-300"
    >
      <div class="flex max-md:flex-col gap-10 md:items-center">
        <NuxtLink :to="$nuxt.$localePath('/')">
          <img width="75" height="75" src="/logo.svg" alt="Nuha logo" />
        </NuxtLink>
        <div>
          <span class="text-2xl font-light leading-none">Nuha نهى</span>
          <p class="text-nuha-grey-100 text-base leading-none">{{ $t('footer.copyright') }}</p>
        </div>
      </div>
      <nav class="flex max-md:flex-col gap-6 justify-end">
        <NuxtLink
          v-for="(link, i) in links"
          :key="i"
          class="link link-nav link-hover max-md:min-w-max !text-base"
          :to="link.path"
          :external="link.external"
          :target="link.external ? '_blank' : '_self'"
          >{{ link.title() }}</NuxtLink
        >
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const { t } = useI18n()
  const localePath = useLocalePath()
  type Link = {
    title(): string
    path: string
    external?: boolean
  }
  const links = <Link[]>[
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
  ]
</script>

<style scoped lang="postcss"></style>
