<template>
  <div class="sm:hidden">
    <Mobile />
  </div>
  <div class="hidden sm:block">
    <Desktop />
  </div>
</template>

<script setup lang="ts">
  import Mobile from './Mobile.vue'
  import Desktop from './Desktop.vue'
</script>
