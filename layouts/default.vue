<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
  >
    <Body>
      <NuxtRouteAnnouncer />
      <UiHeader />
      <main id="main_app_container">
        <NuxtPage class="container py-8" />
      </main>
      <UiFooter />
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
body, #__nuxt, #main_app_container {
  @apply h-screen bg-colors-neutral-background text-colors-neutral-foreground;
}
#main_app_container {
  @apply h-full flex flex-col;
}

#__nuxt {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
