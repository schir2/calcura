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
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">Expense Plan</h2>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <CommonCard @click="plan.activeExpensePlan=ExpensePlanType.Simple" :class="{'bg-skin-accent': plan.activeExpensePlan===ExpensePlanType.Simple}">
          <h3 class="text-2xl">Simple Expense Plan</h3>
        </CommonCard>
        <CommonCard @click="plan.activeExpensePlan=ExpensePlanType.Itemized" :class="{'bg-skin-accent': plan.activeExpensePlan===ExpensePlanType.Itemized}">
          <h3 class="text-2xl">Itemized Expense Plan</h3>
        </CommonCard>
      </div>
      <PlanExpense
          v-if="plan.activeExpensePlan===ExpensePlanType.Simple"
          v-for="(expense, index) in plan.simpleExpensePlan.expenses"
          :key="index"
          :expenseIndex="index"
          :expense="expense"
      />
      <PlanExpense
          v-if="plan.activeExpensePlan===ExpensePlanType.Itemized"
          v-for="(expense, index) in plan.itemizedExpensePlan.expenses"
          :key="index"
          :expenseIndex="index"
          :expense="expense"
          :showAdvancedOptions="true"
      />
    </CommonCard>

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
import {ExpensePlanType} from "~/models/ExpensePlan";

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
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>