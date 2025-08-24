<template>
  <Transition
    name="input-method"
    mode="out-in"
    :enter-active-class="`input-method-enter-active ${directionValue === 0 ? 'method-0' : 'method-1'}`"
    :leave-active-class="`input-method-leave-active ${directionValue === 0 ? 'method-0' : 'method-1'}`"
    :enter-from-class="`input-method-enter-from ${directionValue === 0 ? 'method-0' : 'method-1'}`"
    :leave-to-class="`input-method-leave-to ${directionValue === 0 ? 'method-0' : 'method-1'}`"
  >
  <slot />
  </Transition>
</template>

<script lang="ts" setup>
defineProps({
  directionValue: {
    type: Number,
    default: 0,
  }
})
</script>

<style>
.input-method-enter-active,
.input-method-leave-active {
  transition: all 0.1s ease-out;
}

.input-method-enter-from.method-0 {
  opacity: 0;
  transform: translateX(-10px);
}

.input-method-leave-to.method-0 {
  opacity: 0;
  transform: translateX(10px);
}

.input-method-enter-from.method-1 {
  opacity: 0;
  transform: translateX(10px);
}

.input-method-leave-to.method-1 {
  opacity: 0;
  transform: translateX(-10px);
}
</style>