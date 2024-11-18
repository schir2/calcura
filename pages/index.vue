<template>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>
    <h2 class="text-2xl">Income(s)</h2>

    <CommonButton @click="plan.addIncome()">Add Income</CommonButton>
    <PlanIncome
        v-for="(income, index) in plan.incomes"
        :income="income"
        :key="index"
        :incomeIndex="index"
        :showAdvancedOptions="showAdvancedOptions"
        @deleteIncome="handleDeleteIncome"
    ></PlanIncome>
    <PlanTaxDeferredInvestment :showAdvancedOptions="showAdvancedOptions"/>
  </div>
  <PlanSummary class="col-span-1"/>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";
import Plan from "~/models/Plan";

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

function handleDeleteIncome(payload: { index: number }) {
  plan.deleteIncome(payload.index)
}

const plan = reactive(new Plan(Plan.defaultValues()))

const showAdvancedOptions = ref<boolean>(false)
</script>