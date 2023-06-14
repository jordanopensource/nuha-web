<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="bg-nuha-fushia-100"
  >
    <Body>
      <BuildInfoBanner
        v-if="useRuntimeConfig().public.targetEnv === 'development'"
      />
      <div class="container h-screen">
        <UiAppHeader />
        <Hero />
        <slot />
      </div>
    </Body>
  </Html>
</template>

<script setup lang="ts">
  const head = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
  })
  useHead({
    htmlAttrs: {
      lang: head.value.htmlAttrs!.lang,
      dir: head.value.htmlAttrs!.dir,
    },
  })
</script>
