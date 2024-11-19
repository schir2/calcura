<template>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>

    <!-- Incomes -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">Income(s)</h2>
        <CommonButton @click="plan.addIncome()">Add Income</CommonButton>
      </div>
      <TransitionGroup
          name="custom-classes"
          enter-active-class="animate__animated animate__tada"
          leave-active-class="animate__animated animate__bounceOutRight"
      >
        <PlanIncome
            v-for="(income, index) in plan.incomes"
            :income="income"
            :key="index"
            :incomeIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteIncome="handleDeleteIncome"
        ></PlanIncome>
      </TransitionGroup>
    </CommonCard>

    <!-- Expenses -->
    <PlanExpensePlan :simpleExpensePlan="plan.simpleExpensePlan" :itemizedExpensePlan="plan.itemizedExpensePlan"></PlanExpensePlan>

    <!-- Cash Maintenance -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Cash to Maintain</h2>
      </nav>
      <PlanCash
          :cash="plan.cash"
          :showAdvancedOptions="showAdvancedOptions"
      ></PlanCash>
    </CommonCard>

    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Debt(s)</h2>
        <CommonButton @click="plan.addDebt()">Add Debt</CommonButton>
      </nav>
      <PlanDebt
          v-for="(debt, index) in plan.debts"
          :debt="debt"
          :key="index"
          :debtIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteDebt="handleDeleteDebt"
      ></PlanDebt>
    </CommonCard>
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Tax Deferred Investments</h2>
        <CommonButton @click="plan.addTaxDeferredInvestment()">Add Income</CommonButton>
      </nav>
      <PlanTaxDeferredInvestment
          v-for="(investment, index) in plan.taxDeferredInvestments"
          :investment="investment"
          :key="index"
          :investmentIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteInvestment="handleDeleteTaxDeferredInvestment"
      />
    </CommonCard>
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