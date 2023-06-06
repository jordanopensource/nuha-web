<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="bg-nuha-fushia-100"
  >
    <Navigator />
    <Hero />
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
