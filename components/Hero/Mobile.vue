<template>
  <div class="container" v-if="!data.showWaitlist">
    <h1 class="text">
      {{ text }}
    </h1>
    <h2 class="sub-text">
      {{ subText }}
    </h2>
  </div>
  <div class="join-waitlist">
    <Waitlist
      v-model:showWaitlist="data.showWaitlist"
      @update:showWaitlist="(value: boolean) => {data.showWaitlist = value}"
    />
  </div>
  <Statistics />
</template>

<script lang="ts" setup>
  import Statistics from '../Statistics/Mobile.vue'
  import { reactive } from 'vue'
  import Waitlist from './Waitlist/index.vue'

  defineProps({
    text: {
      type: String,
    },
    subText: {
      type: String,
    },
  })

  let data = reactive({ showWaitlist: false })
</script>

<style lang="postcss" scoped>
  .container {
    @apply px-14 rtl:px-16 py-2.5 pt-10 text-nuha-fushia-300 antialiased text-left rtl:text-right italic;
  }
  .text {
    @apply text-4xl font-light pb-3;
  }
  .sub-text {
    @apply text-4xl font-medium leading-[50px];
  }
</style>
