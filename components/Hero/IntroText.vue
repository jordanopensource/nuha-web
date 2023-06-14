<template>
  <div class="text">
    <h1>
      <span class="main">
        {{ $t('intro.text') }}
      </span>
      <span class="sub">
        {{ $t('intro.sub') }}
      </span>
    </h1>
  </div>
</template>

<style lang="postcss" scoped>
  .text {
    @apply text-nuha-fushia-300 px-10 text-4xl lg:text-6xl italic leading-snug;
    .main {
      @apply inline font-light;
    }

    .sub {
      @apply inline font-semibold font-IBMPlexSansArabic;
    }
  }
</style>
