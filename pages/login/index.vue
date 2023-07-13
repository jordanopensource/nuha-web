<template>
  <div class="container h-screen w-screen">
    <UiAppHeader />
    <Login />
  </div>
</template>
<script setup lang="ts">
  definePageMeta({ auth: false })
</script>
