<template>
  <header>
    <div class="xl:hidden">
      <Mobile
        v-model:showWaitlist="data.showWaitlist"
        @update:showWaitlist="(value: boolean) => {emit('update:showWaitlist', value)}"
        @submit:joinWaitlist="(email: string) => {sendEmail(email)}"
      />
    </div>
    <div class="hidden xl:block">
      <Desktop
        v-model:showWaitlist="data.showWaitlist"
        @update:showWaitlist="(value: boolean) => {emit('update:showWaitlist', value)}"
        @submit:joinWaitlist="(email: string) => {sendEmail(email)}"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
  import Mobile from './Mobile.vue'
  import Desktop from './Desktop.vue'
  import { reactive } from 'vue'

  const data = reactive({
    email: '',
    showWaitlist: false,
  })
  const emit = defineEmits(['update:showWaitlist'])

  async function sendEmail(email: string) {
    // email stuff
    console.log(email)
    emit('update:showWaitlist', false)
  }
</script>
