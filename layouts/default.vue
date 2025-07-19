<template>
  <div>
    <NuxtRouteAnnouncer />
    <div>Path is: {{ route.path }} </div>
    <div>Region is: {{ region }}</div>
    <div>Language is: {{ locale }}</div>
    <div>{{ $t("hello") }}</div>
  </div>
</template>

<script setup lang="ts">
  const { locale } = useI18n()
  const route = useRoute();
  const region = route.params.region;

</script>
