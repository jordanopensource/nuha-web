<template>
  <!--  -->
  <div class="mobile" :style="mobileHeight">
    <button @click="mobileExpand = !mobileExpand" :class="mobileBtnClass">
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
      <div>
        <DoughnutChar class="w-4/5" :speechData="speechData" />
      </div>
      <p class="mobile-content-paragraph">
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
      </p>
      <LearnMore
        :mobileExpand="learnMoreMobileExpand"
        @update:mobileExpand="(show) => updateLearnMoreMobileExpand(show)"
      />
    </div>
  </div>
  <!-- duplicated to still appear after hiding the statistics  -->
  <LearnMore
    v-if="learnMoreMobileExpand"
    :mobileExpand="learnMoreMobileExpand"
    @update:mobileExpand="(show) => updateLearnMoreMobileExpand(show)"
  />
  <!--  -->
  <div class="desktop" id="statistics">
    <h1 class="desktop-header">{ {{ $t('link.statistics') }} }</h1>
    <div class="desktop-content">
      <div class="w-3/5">
        <DoughnutChar class="w-full" :speechData="speechData" />
      </div>
      <p class="desktop-content-paragraph">
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
      </p>
    </div>

    <LearnMore />
  </div>
  <!--  -->
</template>

<script setup lang="ts">
  import LearnMore from '../LearnMore/index.vue'
  import DoughnutChar from './DoughnutChart.vue'
  import { computed, ref } from 'vue'

  const mobileExpand = ref(false)
  const mobileHeight = computed(() => {
    return mobileExpand.value
      ? 'min-height: 85vh; padding: 30px 10px 0;'
      : 'height: auto;'
  })

  const learnMoreMobileExpand = ref(false)
  function updateLearnMoreMobileExpand(show: boolean) {
    learnMoreMobileExpand.value = show
    mobileExpand.value = !show
  }

  const mobileBtnClass = computed(() => {
    return mobileExpand.value ? 'mobile-btn-expanded' : 'mobile-btn'
  })

  const speechData: { speech: string; percentage: number }[] = [
    { speech: 'Hate speech', percentage: 57 },
    { speech: 'Positive speech', percentage: 23 },
    { speech: 'Unrelated to discussion', percentage: 15.99 },
    { speech: 'Neutral', percentage: 4.01 },
  ]
</script>

<style lang="postcss" scoped>
  .mobile {
    @apply sm:hidden absolute bottom-0 bg-nuha-grey h-16 w-screen rounded-t-3xl p-5 grid grid-cols-1 place-items-center overflow-y-scroll;

    &-content {
      @apply pt-8 px-8 grid grid-cols-1 place-items-center gap-7 text-white h-full;

      &-paragraph {
        @apply text-xl;
      }
    }
    &-btn {
      @apply flex items-center text-white;

      &-expanded {
        @apply flex items-center text-white text-2xl;
      }

      &-arrow {
        @apply inline-block px-1;
      }
    }
  }
  .desktop {
    @apply hidden sm:grid grid-cols-1 place-items-center;

    &-header {
      @apply text-nuha-grey text-6xl text-center w-full font-bold italic;
    }

    &-content {
      @apply my-14 pr-20 rtl:pl-20 grid grid-cols-2 place-items-center gap-0 bg-nuha-grey w-4/5 min-h-[700px] h-auto rounded-3xl shadow-xl;

      &-paragraph {
        @apply text-lg text-white ltr:text-left rtl:text-right;
      }
    }
  }
</style>
