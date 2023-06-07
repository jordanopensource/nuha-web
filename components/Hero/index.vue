<template>
  <div class="sm:hidden">
    <div class="mobile" v-if="!data.showWaitlist">
      <h1 class="mobile-text">
        {{ $t('info.1') }}
      </h1>
      <h2 class="mobile-sub-text">
        {{ $t('info.2') }}
      </h2>
    </div>
    <div class="mobile-join-waitlist">
      <Waitlist
        v-model:showWaitlist="data.showWaitlist"
        @update:showWaitlist="(value: boolean) => {data.showWaitlist = value}"
      />
    </div>
    <Statistics />
  </div>

  <div class="desktop">
    <div>
      <h1 class="desktop-text">{{ $t('info.1') }}&nbsp;</h1>
      <span class="desktop-sub-text">{{ $t('info.2') }}</span>
    </div>
    <Waitlist
      v-model:showWaitlist="data.showWaitlist"
      @update:showWaitlist="(value: boolean) => {data.showWaitlist = value}"
    />
  </div>
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
  .mobile {
    @apply px-14 rtl:px-16 py-2.5 text-nuha-fushia-300 antialiased text-left rtl:text-right italic;

    &-text {
      @apply text-4xl font-light pb-3;
    }
    &-sub-text {
      @apply text-4xl font-medium leading-[50px];
    }
    &-join-waitlist {
      @apply grid grid-cols-1 place-items-center pt-10 w-full;
    }
  }

  .desktop {
    @apply hidden sm:flex justify-between gap-x-32 items-center px-20 rtl:px-16 py-2.5 pt-16 text-nuha-fushia-300 antialiased text-left rtl:text-right italic;
    &-text {
      @apply text-5xl font-normal pb-3 inline-block;
    }
    &-sub-text {
      @apply text-5xl font-bold leading-15 break-words;
    }
  }
</style>
