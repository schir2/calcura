<template>
  <h2 class="text-3xl">Plan Summary</h2>
  <section>
    <h3 class="text-2xl">Retirement Plan</h3>
  </section>
  <section>
    <h3 class="text-2xl">Incomes</h3>
    <ul v-if="incomeSummary">
      <li v-for="(income, type) in incomeSummary" :Key="type">
        {{income}}
      </li>
    </ul>
  </section>
  <section>
    <h3 class="text-2xl">Expenses</h3>
  </section>
  <section>
    <h3 class="text-2xl">Investments</h3>
  </section>

</template>
<script setup lang="ts">
import PlanManager from "~/models/plan/PlanManager";

interface Props {
  planManager: PlanManager
}

const props = defineProps<Props>()

const incomeSummary = computed(() => props.planManager.getIncomeSummary())

</script>
