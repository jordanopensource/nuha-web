<template>
  <div class="container">
    <Upload class="container" />
  </div>
</template>
<script setup lang="ts">
  definePageMeta({ auth: true, callbackUrl: '/login' })
</script>
