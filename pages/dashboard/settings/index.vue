<template>
  <UiAppHeader />
  dashboard/settings
</template>
<script setup lang="ts">
  definePageMeta({ auth: true, callbackUrl: '/login' })
</script>
