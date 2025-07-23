<template>
  <div>
    <NuxtRouteAnnouncer />
    <div>Path is: {{ route.path }} </div>
    <div>Region Param is: {{ region }}</div>
    <ClientOnly>
      <div>Detected Region is: {{ userRegion?.country }}</div>
      <div>Detected Region code: {{ userRegion?.countryCode }}</div>
    </ClientOnly>
    <div>Language is: {{ locale }}</div>
    <div>{{ $t("hello") }}</div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  const { locale } = useI18n()
  const route = useRoute();
  const region = route.params.region;
  const { region: userRegion } = useGeolocation()

</script>
