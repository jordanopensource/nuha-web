<template>
  <div class="join-waitlist">
    <div v-if="showWaitlist" class="join-waitlist-modal">
      <h1 class="font-medium w-full text-center italic text-2xl">
        {{ $t('waitlist.join') }}
      </h1>

      <div class="join-waitlist-modal-submission">
        <h1 class="join-waitlist-modal-submission-header">
          {{ $t('waitlist.enterEmail', data.email) }}:
        </h1>

        <form
          action="#"
          @submit="
            (e) => {
              e.preventDefault()
              emit('submit:joinWaitlist', data.email)
              emit('update:showWaitlist', false)
              data.email = ''
            }
          "
        >
          <input
            class="join-waitlist-modal-submission-email"
            type="email"
            required
            placeholder="someone@example.com"
            v-model="data.email"
          />
          <input
            class="join-waitlist-modal-submission-input"
            type="submit"
            :value="$t('waitlist.done')"
          />
        </form>
      </div>
    </div>

    <div v-else>
      <button
        class="btn"
        @click="emit('update:showWaitlist', !props.showWaitlist)"
      >
        {{ $t('waitlist.join') }}
      </button>

      <NuxtLink class="learn-more" to="learn-more">{{
        $t('link.learnMore')
      }}</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive } from 'vue'

  const props = defineProps(['showWaitlist'])
  const emit = defineEmits(['update:showWaitlist', 'submit:joinWaitlist'])

  const showWaitlist = computed({
    get() {
      return props.showWaitlist
    },
    set(value) {
      emit('update:showWaitlist', value)
    },
  })

  const data = reactive({ email: '' })
</script>

<style lang="postcss" scoped>
  .join-waitlist {
    @apply grid grid-cols-1 place-items-center w-96 font-IBMPlexMono;

    &-modal {
      @apply bg-nuha-fushia-300 text-white rounded-3xl p-11 min-h-full h-4/5 w-4/5;

      &-submission {
        @apply pt-10;

        &-header {
          @apply text-left rtl:text-right text-xl;
        }
        &-email {
          @apply mt-5 bg-nuha-fushia-200 border-nuha-fushia-200 p-4 placeholder:text-nuha-grey-300 placeholder:text-sm text-nuha-grey border-4 rounded-xl h-20 w-full;
        }
        &-input {
          @apply mt-2 float-right rtl:float-left px-4 py-2 bg-nuha-fushia-100 rounded-xl text-nuha-fushia-300;
        }
      }
    }
  }
  .btn {
    @apply p-2 px-12 text-white text-lg bg-nuha-fushia-300 rounded-full shadow-nuha-fushia shadow-md italic;
  }
  .learn-more {
    @apply grid grid-cols-1 place-items-center pt-7 italic text-xl font-medium underline text-nuha-fushia;
  }
</style>
