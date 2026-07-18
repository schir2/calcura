<!-- Public landing page: hero, learn/plan question cards, teaching charts, tool placeholder, sign-up. -->
<template>
  <div class="space-y-10 px-4">
    <!-- Full-bleed hero -->
    <LandingHero />

    <!-- Question rows -->
    <section class="space-y-6">
      <LandingQuestionCards />
      <p class="text-sm text-skin-muted text-center max-w-5xl mx-auto">
        Models income, expenses, debt, brokerage, 401(k), Traditional &amp; Roth IRA, and cash reserves.
      </p>
    </section>

    <!-- Charts -->
    <section class="grid lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
      <LandingInflationErosionChart />
      <LandingCashVsInvestedChart />
    </section>

    <!-- Tool placeholder (below the charts for now) -->
    <section class="max-w-4xl mx-auto">
      <LandingToolPlaceholder />
    </section>

    <!-- Convert -->
    <section class="max-w-4xl mx-auto">
      <n-card class="text-center" size="huge">
        <h2 class="text-title mb-2">Like what you build?</h2>
        <p class="text-skin-muted mb-5">Create a free account to save your plans and keep exploring.</p>
        <LandingCtas center />
      </n-card>
    </section>
  </div>
</template>

<script lang="ts" setup>
import LandingCtas from './LandingCtas.vue'
import LandingHero from './LandingHero.vue'
import LandingToolPlaceholder from './ToolPlaceholder.vue'
import LandingInflationErosionChart from './InflationErosionChart.vue'
import LandingCashVsInvestedChart from './CashVsInvestedChart.vue'
import LandingQuestionCards from './LandingQuestionCards.vue'
</script>
