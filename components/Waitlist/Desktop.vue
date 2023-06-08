<template>
  <div class="main">
    <h1 class="header">{{ $t('waitlist.join') }}</h1>
    <div class="modal">
      <h1 class="enter-email">{{ $t('waitlist.enterEmail', data.email) }}:</h1>
      <form
        action="#"
        class="pb-8"
        @submit="
          (e) => {
            e.preventDefault()
            emit('submit:joinWaitlist', data.email)
            data.email = ''
          }
        "
      >
        <input
          class="email"
          type="email"
          required
          placeholder="someone@example.com"
          v-model="data.email"
        />
        <input class="btn" type="submit" :value="$t('waitlist.done')" />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'

  const emit = defineEmits(['submit:joinWaitlist'])
  const data = reactive({ email: '' })
</script>

<style lang="postcss" scoped>
  .main {
    @apply w-96;
  }
  .header {
    @apply text-3xl italic text-nuha-fushia-300 font-semibold px-3;
  }
  .modal {
    @apply shadow-nuha-fushia-300 shadow-lg rounded-3xl bg-nuha-fushia-300 p-10 mt-2;
  }
  .enter-email {
    @apply text-left text-white rtl:text-right text-xl;
  }
  .email {
    @apply mt-5 bg-nuha-fushia-100 border-nuha-fushia-200 p-4 placeholder:text-nuha-grey-300 text-nuha-grey border-4 rounded-xl h-14 w-full;
  }
  .btn {
    @apply mt-2 float-right rtl:float-left px-5 py-1 bg-nuha-fushia-100 rounded-xl text-nuha-fushia-300;
  }
</style>
