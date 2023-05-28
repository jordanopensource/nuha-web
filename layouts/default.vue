<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="bg-nuha-fushia-bg"
    :class="fontClass"
  >
    <slot />
  </Html>
</template>

<script setup lang="ts">
  const head = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
  })
  const fontClass =
    head.value.htmlAttrs!.land === 'en'
      ? 'font-IBMPlexMono'
      : 'font-IBMPlexSansArabic'
  useHead({
    htmlAttrs: {
      lang: head.value.htmlAttrs!.lang,
      dir: head.value.htmlAttrs!.dir,
    },
  })
</script>
