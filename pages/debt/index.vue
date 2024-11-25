<template>
  <div class="container">
    <PlanDebt :debtIndex=1 :debt="debtConfig" :showAdvancedOptions="false "/>
    <div class="grid grid-cols-2 gap-6">
      <table>
        <thead>
        <tr>
          <th>payment</th>
          <th>principalStartOfYear</th>
          <th>interestAmount</th>
          <th>principalEndOfYear</th>
          <th>processed</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(state, index) in debtManager.getStates()">
          <td>{{ state.payment }}</td>
          <td>{{ state.principalStartOfYear }}</td>
          <td>{{ state.interestAmount }}</td>
          <td>{{ state.principalEndOfYear }}</td>
          <td>{{ state.processed }}</td>
        </tr>
        </tbody>
      </table>
      <table>
        <thead>
        <tr>
          <th>Disposable Income</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(state, index) in planStates">
          <td>{{ state.taxedIncome }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import DebtConfig from '~/models/debt/DebtConfig';
import DebtManager from '~/models/debt/DebtManager';
import type PlanState from '~/models/plan/PlanState';
import type DebtState from "~/models/debt/DebtState";
import PlanConfig from "~/models/plan/PlanConfig";
import PlanManager from "~/models/plan/PlanManager";

const debtConfig = reactive(new DebtConfig(DebtConfig.defaultValues()));
const planConfig = new PlanConfig(PlanConfig.defaultValues());
const planManager = ref(new PlanManager(planConfig));
const debtManager = ref(new DebtManager(debtConfig));
const MAX_ITERATIONS = 30;

watch(debtConfig, (newValue) => {
  let i = 0;
  debtManager.value = new DebtManager(newValue);
  let planState: PlanState = {
    age: 30,
    year: 2024,
    grossIncome: 100000,
    taxedIncome: 70000,
    taxableIncome: 10000,
    electiveLimit: 22500,
    deferredLimit: 66000,
    iraLimit: 7000,
    inflationRate: 3,
    savingsStartOfYear: 0,
    savingsEndOfYear: 0,
    allowNegativeDisposableIncome: 'none',
  };
  planStates.value = [planState];
  while (i < MAX_ITERATIONS) {
    debtManager.value.getCommands().forEach((c) => {
      planStates.value.push(c.execute(planState))
    })
    const currentState: DebtState = debtManager.value.getCurrentState();
    // planStates.value.push(planState);
    if (currentState.principalEndOfYear !== undefined && currentState.principalEndOfYear <= 0) {
      console.log("Debt fully paid off. Stopping iteration.");
      break;

    }
    if (planState.taxedIncome <= 0) {
      console.log("No more disposable income. Stopping iteration.");
      break;
    }
    if (i == MAX_ITERATIONS - 1) {
      break;
    }
    debtManager.value.advanceTimePeriod();
    i += 1;
  }
}, {deep: true});
</script>
