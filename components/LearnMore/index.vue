<template>
  <div class="mobile" :style="mobileHeight">
    <button
      @click="emit('update:mobileExpand', !mobileExpand)"
      class="mobile-btn"
    >
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

    <div class="mobile-content" v-if="mobileExpand.valueOf()">
      <div>
        <h1 class="mobile-content-header">{ {{ $t('header.whatIsNuha') }} }</h1>
        <p class="mobile-content-paragraph">
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
          enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
          exercitation amet. Nisi anim cupidatat excepteur officia.
          Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
          voluptate dolor minim nulla est proident. Nostrud officia pariatur ut
          officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate.
          Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis
          officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
          sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea
          consectetur et est culpa et culpa duis.
        </p>
      </div>
      <div>
        <h1 class="mobile-content-header">{ {{ $t('header.howItWorks') }} }</h1>
        <p class="mobile-content-paragraph">
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
          enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
          exercitation amet. Nisi anim cupidatat excepteur officia.
          Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
          voluptate dolor minim nulla est proident. Nostrud officia pariatur ut
          officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate.
          Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis
          officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
          sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea
          consectetur et est culpa et culpa duis.
        </p>
      </div>
    </div>
  </div>

  <div class="desktop" id="learn-more">
    <div>
      <h1 class="desktop-content-header">{ {{ $t('header.whatIsNuha') }} }</h1>
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
    <div>
      <h1 class="desktop-content-header">{ {{ $t('header.howItWorks') }} }</h1>
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
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    mobileExpand: {
      type: Boolean,
      required: false,
    },
  })

  const emit = defineEmits(['update:mobileExpand'])

  const mobileExpand = computed(() => {
    return props.mobileExpand
  })

  const mobileHeight = computed(() => {
    return props.mobileExpand
      ? 'min-height: 85vh; position: absolute; bottom: 0;'
      : 'height: auto;'
  })
</script>

<style lang="postcss" scoped>
  .mobile {
    @apply xl:hidden bg-nuha-fushia-100 w-screen h-16 rounded-t-3xl p-5 px-10 grid grid-cols-1 place-items-center overflow-y-scroll border-t-nuha-grey border-x-nuha-grey border-2;

    &-content {
      @apply py-10 text-nuha-grey;

      &-header {
        @apply text-nuha-fushia text-3xl font-medium italic w-3/5;
      }

      &-paragraph {
        @apply text-nuha-grey py-10 text-lg;
      }
    }
    &-btn {
      @apply flex items-center text-nuha-fushia text-xl;

      &-arrow {
        @apply inline-block px-1;
      }
    }
  }
  .desktop {
    @apply hidden xl:block mt-20 px-40;

    &-content {
      @apply py-10 text-nuha-grey;

      &-header {
        @apply text-nuha-fushia text-6xl font-medium italic w-3/5;
      }

      &-paragraph {
        @apply text-nuha-grey py-20 text-2xl;
      }
    }
  }
</style>
