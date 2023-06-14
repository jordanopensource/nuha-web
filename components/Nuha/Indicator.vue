<template>
  <div
    class="bg-nuha-fushia-100 rounded-t-[2.75rem] text-center text-nuha-fushia text-2xl py-24 lg:hidden snap-end relative"
  >
    <NuxtLink to="#learn-more">
      <span class="cursor-pointer">
        {{ t('nuha.title') }} <br />
        <i class="arrow down"></i>
      </span>
    </NuxtLink>
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss">
  .arrow {
    @apply border-solid border-nuha-fushia;
    border-width: 0 3px 3px 0;
    @apply inline-block;
    @apply mx-3 mb-2 p-2;
  }

  .down {
    @apply rotate-45;
  }

  @keyframes move {
    0% {
      transform: translateY(-50%);
    }
    25% {
      transform: translateY(-35%);
    }
    50% {
      transform: translateY(-50%);
    }

    75% {
      transform: translateY(-35%);
    }

    100% {
      transform: translateY(-50%);
    }
  }
</style>
