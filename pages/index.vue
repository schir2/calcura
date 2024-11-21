<template>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>

    <!-- Incomes -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">IncomeConfig(s)</h2>
        <CommonButton @click="plan.addIncome()">Add IncomeConfig</CommonButton>
      </div>
      <CommonList>
        <PlanIncome
            v-for="(income, index) in plan.incomes"
            :income="income"
            :key="index"
            :incomeIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteIncome="handleDeleteIncome"
        ></PlanIncome>
      </CommonList>
    </CommonCard>

    <!-- Expenses -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">ExpenseConfig PlanConfig</h2>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <CommonCard @click="plan.activeExpensePlan=ExpensePlanType.Simple" :class="{'bg-skin-accent': plan.activeExpensePlan===ExpensePlanType.Simple}">
          <h3 class="text-2xl">Simple ExpenseConfig PlanConfig</h3>
        </CommonCard>
        <CommonCard @click="plan.activeExpensePlan=ExpensePlanType.Itemized" :class="{'bg-skin-accent': plan.activeExpensePlan===ExpensePlanType.Itemized}">
          <h3 class="text-2xl">Itemized ExpenseConfig PlanConfig</h3>
        </CommonCard>
      </div>
      <ExpensePlan :expensePlan="plan.simpleExpensePlan"></ExpensePlan>
      <ExpensePlan :expensePlan="plan.itemizedExpensePlan"></ExpensePlan>
    </CommonCard>

    <!-- CashConfig Maintenance -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">CashConfig to Maintain</h2>
      </nav>
      <PlanCash
          :cash="plan.cash"
          :showAdvancedOptions="showAdvancedOptions"
      ></PlanCash>
    </CommonCard>

    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">DebtConfig(s)</h2>
        <CommonButton @click="plan.addDebt()">Add DebtConfig</CommonButton>
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
        <CommonButton @click="plan.addTaxDeferredInvestment()">Add IncomeConfig</CommonButton>
      </nav>
      <CommonList>
        <PlanTaxDeferredInvestment
            v-for="(investment, index) in plan.taxDeferredInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteTaxDeferredInvestment"
        />
      </CommonList>
    </CommonCard>
  </div>
  <PlanSummary class="col-span-1"/>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";
import ExpensePlanConfig from "~/components/plan/ExpensePlan.vue";
import PlanConfig from "~/models/plan/PlanConfig";
import {ExpensePlanType} from "~/models/expense/ExpensePlanConfig";

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

const plan = reactive(new PlanConfig(PlanConfig.defaultValues()))

const showAdvancedOptions = ref<boolean>(false)
</script>