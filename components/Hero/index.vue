<template>
  <div class="container">
    <!--  -->
    <div class="mobile">
      <div v-if="!data.showWaitlist">
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
    </div>
    <!--  -->
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
    <!--  -->
  </div>
  <Statistics />
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import Waitlist from '../Waitlist/index.vue'
  import Statistics from '../Statistics/index.vue'

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
    @apply h-5/6 grid grid-cols-1 place-items-center;
  }

  .mobile {
    @apply sm:hidden px-14 rtl:px-16 py-2.5 text-nuha-fushia-300 antialiased text-left rtl:text-right italic;

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
      @apply text-6xl font-normal pb-3 inline-block;
    }
    &-sub-text {
      @apply text-6xl font-bold leading-15 break-words;
    }
  }
</style>
