<template>
  <div
    class="bg-nuha-grey rounded-t-[2.75rem] text-center text-nuha-fushia-100 text-2xl py-24 pt-12 lg:hidden snap-end relative bottom-16 ignore-container"
  >
    <NuxtLink to="#statistics" class="py-11">
      <span class="moving-text wrapper cursor-pointer">
        {{ t('link.statistics') }} <i class="arrow down"></i>
      </span>
    </NuxtLink>
  </div>
</template>
<script setup>
  const { t } = useI18n()
</script>
<style scoped lang="postcss">
  .ignore-container {
    @apply w-screen left-[-15px] rtl:right-[-15px] p-0 m-0;
  }
  .moving-text {
    @apply text-center;
    animation: move 5s ease-in-out infinite;
  }
  .wrapper {
    @apply flex justify-center items-center py-11;
  }
  .arrow {
    @apply border-solid;
    border-width: 0 3px 3px 0;
    @apply inline-block;
    @apply mx-3 mb-2 p-2;
  }

  .down {
    @apply rotate-45;
  }

  @keyframes move {
    0% {
      transform: translateY(-40%);
    }
    25% {
      transform: translateY(-25%);
    }
    50% {
      transform: translateY(-40%);
    }

    75% {
      transform: translateY(-25%);
    }

    100% {
      transform: translateY(-40%);
    }
  }
</style>
