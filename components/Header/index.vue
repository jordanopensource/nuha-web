<template>
  <div class="xl:hidden">
    <Mobile />
  </div>
  <div class="hidden xl:block">
    <Desktop />
  </div>
</template>

<script setup lang="ts">
  import Mobile from './Mobile.vue'
  import Desktop from './Desktop.vue'
</script>
