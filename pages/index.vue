<template>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>
    <section>
      <h2 class="text-3xl">Income(s)</h2>
      <CommonButton @click="plan.addIncome()">Add Income</CommonButton>
      <PlanIncome
          v-for="(income, index) in plan.incomes"
          :income="income"
          :key="index"
          :incomeIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteIncome="handleDeleteIncome"
      ></PlanIncome>
    </section>
    <section>
      <h2 class="text-3xl">Debt(s)</h2>
      <CommonButton @click="plan.addDebt()">Add Debt</CommonButton>
      <PlanDebt
          v-for="(debt, index) in plan.debts"
          :debt="debt"
          :key="index"
          :debtIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteDebt="handleDeleteDebt"
      ></PlanDebt>
    </section>
    <section>
      <h2 class="text-3xl">Tax Deferred Investments</h2>
      <CommonButton @click="plan.addTaxDeferredInvestment()">Add Income</CommonButton>
      <PlanTaxDeferredInvestment
          v-for="(investment, index) in plan.taxDeferredInvestments"
          :investment="investment"
          :key="index"
          :investmentIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteInvestment="handleDeleteTaxDeferredInvestment"
      />
    </section>
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

function handleDeleteTaxDeferredInvestment(payload: { index: number }) {
  plan.deleteTaxDeferredInvestment(payload.index)
}

function handleDeleteDebt(payload: { index: number }) {
  plan.deleteDebt(payload.index)
}

const plan = reactive(new Plan(Plan.defaultValues()))

const showAdvancedOptions = ref<boolean>(false)
</script>