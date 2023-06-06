<template>
  <div class="main">
    <div>
      <h1 class="text">{{ text }}&nbsp;</h1>
      <span class="sub-text">{{ subText }}</span>
    </div>
    <div class="join-waitlist">
      <Waitlist
        v-model:showWaitlist="data.showWaitlist"
        @update:showWaitlist="(value: boolean) => {data.showWaitlist = value}"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  .main {
    @apply flex justify-between gap-x-32 items-center px-20 rtl:px-16 py-2.5 pt-16 text-nuha-fushia-300 antialiased text-left rtl:text-right italic;
  }
  .text {
    @apply text-5xl font-normal pb-3 inline-block;
  }
  .sub-text {
    @apply text-5xl font-bold leading-15 break-words;
  }
</style>
