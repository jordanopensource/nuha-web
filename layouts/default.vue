<template>
  <Html
    :lang="head.htmlAttrs!.lang"
    :dir="head.htmlAttrs!.dir"
    class="bg-nuha-fushia-100"
  >
    <Body>
      <buildInfoBanner
        v-if="useRuntimeConfig().public.targetEnv === 'development'"
      />
      <UiAppHeader />
      <slot />
      <UiFooter />
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
