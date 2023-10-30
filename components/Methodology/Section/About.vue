<template>
  <section>
    <h2>{{ $t('methodology.sections.about.firstParagraph.title') }}</h2>
    <p class="text">{{ $t('methodology.sections.about.firstParagraph.p1') }}</p>
    <p class="text">{{ $t('methodology.sections.about.firstParagraph.p2') }}</p>
    <figure>
      <img
        src="/images/methodology-cycle.png"
        :alt="$t('methodology.sections.about.firstParagraph.fig1')"
      />
      <figcaption>
        <span class="font-semibold">{{ $t('methodology.figure') }} 1:</span>
        {{ $t('methodology.sections.about.firstParagraph.fig1') }}
      </figcaption>
    </figure>
  </section>
  <section>
    <h2>{{ $t('methodology.sections.about.secondParagraph.title') }}</h2>
    <p class="text">{{ $t('methodology.sections.about.secondParagraph.p1') }}</p>
    <p class="text">{{ $t('methodology.sections.about.secondParagraph.p2') }}</p>
  </section>
  <div class="footnotes">
    <p class="text-2xl">{{ $t('methodology.footnotes') }}</p>
    <ol>
      <li>
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.1') }}
        </a>
      </li>
      <li>
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.2') }}
        </a>
      </li>
      <li>
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.2') }}
        </a>
      </li>
      <li>
        <a href="http://" target="_blank" rel="noopener noreferrer">
          {{ $t('methodology.sections.about.footnotes.1') }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="postcss" scoped>
  div.container {
    section {
      @apply flex flex-col gap-y-10 pt-16 pb-6;
      @apply border-b border-nuha-grey-200;
      h2 {
        @apply mb-4 font-normal text-4xl;
      }
      .text {
        @apply font-normal text-2xl leading-[1.2];
      }
      figure {
        figcaption {
          @apply mt-6 font-IBMPlexSansArabic text-sm;
        }
      }
    }
    .footnotes {
      @apply mb-6 mt-9;
      ol {
        counter-reset: custom;
        list-style-type: none;

        li {
          @apply my-4 font-IBMPlexSansArabic text-sm font-normal;
          &::before {
            content: '[' counter(custom) '] ';
            counter-increment: custom;
            @apply font-semibold;
          }
        }
      }
    }
  }
</style>
