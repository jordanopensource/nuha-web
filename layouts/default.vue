<template>
  <Html :lang="head.htmlAttrs!.lang" :dir="head.htmlAttrs!.dir">
    <Body>
      <NuxtRouteAnnouncer />
      <div class="flex min-h-screen flex-col">
        <UiHeader />
        <main class="flex-1">
          <NuxtPage class="container py-8" />
        </main>
        <UiFooter />
      </div>
    </Body>
  </Html>
</template>

<script setup lang="ts">
  const head = useLocaleHead({
    dir: true,
    lang: true,
    seo: true,
  })
</script>

<style lang="postcss">
  body,
  #__nuxt {
    @apply min-h-screen bg-colors-neutral-background text-colors-neutral-foreground;
  }
</style>
