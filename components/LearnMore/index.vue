<template>
  <div class="mobile" :style="mobileHeight">
    <button @click="mobileExpand = !mobileExpand" class="mobile-btn">
      {{ $t('header.whatIsNuha') }}
      <span class="mobile-btn-arrow">
        <svg
          v-if="!mobileExpand"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>

        <svg
          v-if="mobileExpand"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </span>
    </button>

    <div class="mobile-content" v-if="mobileExpand">
      <div>
        <h1>{ {{ $t('header.whatIsNuha') }} }</h1>
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </div>
      <div>
        <h1>{ {{ $t('header.howItWorks') }} }</h1>
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </div>
    </div>
  </div>

  <div class="desktop" id="learnMore">desktop</div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  const mobileExpand = ref(false)
  const mobileHeight = computed(() => {
    return mobileExpand.value
      ? 'min-height: 85vh; padding-top: 30px;'
      : 'height: auto;'
  })
</script>

<style lang="postcss" scoped>
  .mobile {
    @apply sm:hidden bg-nuha-fushia-100 h-16 w-screen rounded-t-3xl p-5 grid grid-cols-1 place-items-center overflow-y-scroll;

    &-content {
      @apply py-5;
    }
    &-btn {
      @apply flex items-center text-nuha-fushia;

      &-arrow {
        @apply inline-block px-1;
      }
    }
  }
  .desktop {
    @apply hidden sm:block;
  }
</style>
