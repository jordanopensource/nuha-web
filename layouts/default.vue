<template>
  <div id="main_app_container">
    <NuxtRouteAnnouncer />
    <!-- <div>Path is: {{ route.path }} </div>
    <div>Region Param is: {{ region }}</div>
    <ClientOnly>
      <div>Detected Region is: {{ userRegion?.country }}</div>
      <div>Detected Region code: {{ userRegion?.countryCode }}</div>
    </ClientOnly>
    <div>Language is: {{ locale }}</div> -->
    <UiHeader />
    <NuxtPage class="container py-8" />
    <UiFooter />
  </div>
</template>

<script setup lang="ts">
  // const { locale } = useI18n()
  // const route = useRoute();
  // const region = route.params.region;
  // const { region: userRegion } = useGeolocation()

</script>

<style lang="postcss">
body, #__nuxt, #main_app_container {
  @apply h-screen;
}
#main_app_container {
  @apply bg-colors-neutral-background text-colors-neutral-foreground h-full flex flex-col;
}
</style>
