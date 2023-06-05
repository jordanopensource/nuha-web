<template>
  <header>
    <div class="sm:hidden">
      <Mobile :text="$t('info.1')" :subText="$t('info.2')" />
    </div>
    <div class="hidden sm:block">
      <Desktop :text="$t('info.1')" :subText="$t('info.2')" />
    </div>
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
