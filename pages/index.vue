<template>
  <NuxtLayout :name="layout">
    <Navigator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        layout: 'default',
      }
    },
  }
</script>
