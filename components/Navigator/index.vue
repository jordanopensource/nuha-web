<template>
  <header>
    <div class="sm:hidden"><Mobile /></div>
    <div class="hidden sm:block"><Desktop /></div>
  </header>
</template>

<script lang="ts">
  import Mobile from './Mobile.vue'
  import Desktop from './Desktop.vue'
  export default {
    components: {
      Mobile,
      Desktop,
    },
  }
</script>
