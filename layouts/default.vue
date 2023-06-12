<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="bg-nuha-fushia-bg"
  >
    <Body>
      <BuildInfoBanner
        v-if="useRuntimeConfig().public.targetEnv === 'development'"
      />
      <Navigator />
      <slot />
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
