<template>
  <div class="container">
    <PlanDebt :debtIndex=1 :debt="debtConfig" :showAdvancedOptions="false "/>
    <table>
      <tbody>
      <tr v-for></tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import DebtConfig from "~/models/debt/DebtConfig";
import DebtManager from "~/models/debt/DebtManager";
import {AllowNegativeDisposableIncome} from "~/models/plan/PlanConfig";

const debtConfig = ref(new DebtConfig(DebtConfig.defaultValues()))
const debtManager = ref(new DebtManager(debtConfig.value))
const allowNegativeIncome = AllowNegativeDisposableIncome.none
const MAX_ITERATIONS = 30
watch(debtConfig.value, (oldValue, newValue) => {
  let i = 0
  let disposableIncome = 100000
  console.log(newValue)
  debtManager.value = new DebtManager(newValue)
  while (i < MAX_ITERATIONS) {
    const {payment} = debtManager.value.process(disposableIncome, allowNegativeIncome)
    disposableIncome -= payment
    debtManager.value.advanceToNextYear()
    i += 1
  }

})
</script>
