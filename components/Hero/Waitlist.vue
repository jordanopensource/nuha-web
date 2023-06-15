<template>
  <div class="join-waitlist">
    <p
      class="hidden lg:block font-semibold w-full italic text-5xl text-nuha-fushia-300 mb-4 font-IBMPlexSansArabic"
    >
      {{ $t('waitlist.join') }}
    </p>
    <div
      :class="showWaitlist ? 'block' : 'hidden'"
      class="join-waitlist-modal lg:block drop-shadow-2xl shadow-nuha-fushia"
    >
      <p class="font-medium w-full text-center italic text-2xl lg:hidden">
        {{ $t('waitlist.join') }}
      </p>

      <div class="join-waitlist-modal-submission">
        <p class="join-waitlist-modal-submission-header lg:hidden">
          {{ $t('waitlist.enterEmail') }}:
        </p>
        <p class="text-3xl hidden lg:block font-light">
          {{ $t('waitlist.email') }}:
        </p>
        <p v-if="formMessage" class="mt-8 mb-4">
          {{ $t(formMessage) }}
        </p>
        <!-- action="https://monk.josa.ngo/subscription/form" method="post" -->
        <form v-if="!loading" id="form" @submit.prevent="submitForm">
          <input
            class="join-waitlist-modal-submission-email"
            type="email"
            name="email"
            required
            placeholder="someone@example.com"
          />
          <input
            class="join-waitlist-modal-submission-input"
            type="submit"
            :value="$t('waitlist.done')"
          />
          <input
            id="a9cbf"
            type="hidden"
            name="l"
            checked
            value="a9cbf367-a3df-4bc4-8373-0148413bea4d"
          />
        </form>
        <div v-else class="loader my-8"></div>
      </div>
    </div>

    <div>
      <button
        v-if="!showWaitlist"
        class="btn lg:hidden"
        @click="showWaitlist = !showWaitlist"
      >
        {{ $t('waitlist.join') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { set } from '@vueuse/core'

  const showWaitlist = ref(false)
  const loading = ref(false)
  const formMessage = ref('')

  const submitForm = async () => {
    set(loading, true)
    const formData = new FormData(document.getElementById('form'))

    await $fetch('https://monk.josa.ngo/subscription/form', {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
      .then(() => {
        updateLoading('waitlist.send.success')
      })
      .catch((error) => {
        console.log(error)
        updateLoading('waitlist.send.fail')
      })
  }

  const updateLoading = (message: String) => {
    setTimeout(() => {
      set(formMessage, message)
      set(loading, false)
      setTimeout(() => {
        set(formMessage, '')
        set(showWaitlist, false)
      }, 2000)
    }, 2000)
  }
</script>
<style lang="postcss" scoped>
  .join-waitlist {
    @apply grid grid-cols-1 place-items-center w-96 font-IBMPlexMono;

    &-modal {
      @apply bg-nuha-fushia-300 text-white rounded-3xl p-11 lg:py-8 min-h-full h-4/5 w-4/5 lg:w-full;

      &-submission {
        @apply pt-10 lg:p-0;

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
