<template>
  <!--  -->
  <div class="mobile" :style="mobileHeight">
    <button @click="mobileExpand = !mobileExpand" class="mobile-btn">
      {{ $t('link.statistics') }}
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
      <span class="px-5">
        Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
        enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
        exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit
        nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor
        minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure
        elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor
        Lorem duis laboris cupidatat officia voluptate. Culpa proident
        adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod.
        Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
        Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa
        et culpa duis.
      </span>
      <LearnMore />
    </div>
  </div>
  <!--  -->
  <div class="desktop" id="statistics">
    desktop
    <LearnMore />
  </div>
  <!--  -->
</template>

<script setup lang="ts">
  import LearnMore from '../LearnMore/index.vue'
  import { computed, ref } from 'vue'

  const mobileExpand = ref(false)
  const mobileHeight = computed(() => {
    return mobileExpand.value
      ? 'min-height: 85vh; padding: 30px 10px 0;'
      : 'height: auto;'
  })
</script>

<style lang="postcss" scoped>
  .mobile {
    @apply sm:hidden absolute bottom-0 bg-nuha-grey h-16 w-screen rounded-t-3xl p-5 grid grid-cols-1 place-items-center overflow-y-scroll;

    &-content {
      @apply pt-5;
    }
    &-btn {
      @apply flex items-center text-white;

      &-arrow {
        @apply inline-block px-1;
      }
    }
  }
  .desktop {
    @apply hidden sm:block;
  }
</style>
