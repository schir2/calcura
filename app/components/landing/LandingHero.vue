<!-- Full-bleed hero: darkened image background, headline + CTAs with a soft text shadow. -->
<template>
  <section class="relative rounded-2xl overflow-hidden">
    <div
      class="absolute inset-0 bg-cover bg-center brightness-50"
      :style="{ backgroundImage: `url(${heroImg})` }"
    />
    <div class="relative px-6 py-20 md:py-28 text-center max-w-2xl mx-auto space-y-5">
      <h1 class="text-display md:text-6xl text-skin-base [text-shadow:0_2px_14px_rgba(0,0,0,0.75)]">
        Play with your money decisions.
      </h1>
      <p class="text-lg md:text-xl font-light text-skin-base [text-shadow:0_2px_14px_rgba(0,0,0,0.75)]">
        Calcura turns retirement planning into something you can see. Change a number, reorder your priorities,
        and watch decades of impact update instantly.
      </p>
      <LandingCtas center />
    </div>
  </section>
</template>

<script lang="ts" setup>
import heroImg from '~/assets/img/landing/hero-sprout.jpg'
import LandingCtas from './LandingCtas.vue'
</script>
