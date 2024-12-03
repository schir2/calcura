<template>
  <ClientOnly>
    <Teleport to="#right-side-bar">
      <PlanSummary :planConfig="planConfig"></PlanSummary>
    </Teleport>
  </ClientOnly>
  <ClientOnly>
    <Teleport to="#left-side-bar">
      <PlanProjection :planStates="planStates"></PlanProjection>
    </Teleport>
  </ClientOnly>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :retirementConfig="planConfig.retirement" :showAdvancedOptions="showAdvancedOptions"/>

    <!-- Incomes -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">Income(s)</h2>
        <CommonButton iconLeft="mdi:add" @click="handleAddIncome">Add Income</CommonButton>
      </div>
      <CommonList>
        <PlanIncome
            v-for="(income, index) in planConfig.incomes"
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
        <h2 class="text-3xl">Expenses</h2>
        <CommonButton iconLeft="mdi:add" @click="handleAddExpense">Add Expense</CommonButton>
      </div>
      <CommonList>
        <PlanExpense
            v-for="(expense, index) in planConfig.expenses"
            :key="index"
            :expenseIndex="index"
            :expense="expense"
            @deleteExpense="handleDeleteExpense"
        />
      </CommonList>
    </CommonCard>

    <!-- CashConfig Maintenance -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">CashConfig to Maintain</h2>
      </nav>
      <PlanCash
          :cash="planConfig.cash"
          :showAdvancedOptions="showAdvancedOptions"
      ></PlanCash>
    </CommonCard>

    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Debt(s)</h2>
        <CommonButton iconLeft="mdi:add" @click="handleAddDebt">Add Debt</CommonButton>
      </nav>
      <PlanDebt
          v-for="(debt, index) in planConfig.debts"
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
        <CommonButton @click="handleAddTaxDeferredInvestment">Add Tax Deferred Investment</CommonButton>
      </nav>
      <CommonList>
        <PlanTaxDeferredInvestment
            v-for="(investment, index) in planConfig.taxDeferredInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteTaxDeferredInvestment"
        />
      </CommonList>
    </CommonCard>
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Brokerage Investments</h2>
        <CommonButton @click="handleAddBrokerageInvestment">Add Brokerage Investment</CommonButton>
      </nav>
      <CommonList>
        <PlanBrokerageInvestment
            v-for="(investment, index) in planConfig.brokerageInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteBrokerageInvestment"
        />
      </CommonList>
    </CommonCard>
  </div>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";
import PlanManager from "~/models/plan/PlanManager";
import {defaultPlanFactory} from "~/models/plan/PlanFactories";
import {defaultIncomeFactory} from "~/models/income/IncomeFactories";
import {defaultTaxDeferredInvestmentFactory} from "~/models/taxDeferred/TaxDeferredInvestmentFactories";
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import {simpleExpenseFactory} from "~/models/expense/ExpenseFactories";
import {defaultBrokerageInvestmentFactory} from "~/models/brokerage/BrokerageInvestmentFactories";
import type PlanState from "~/models/plan/PlanState";

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

function handleAddIncome() {
  planConfig.incomes.push(defaultIncomeFactory())
}

function handleDeleteIncome(payload: { index: number }) {
  planConfig.incomes.splice(payload.index, 1)
}

function handleAddTaxDeferredInvestment() {
  planConfig.taxDeferredInvestments.push(defaultTaxDeferredInvestmentFactory())
}

function handleDeleteTaxDeferredInvestment(payload: { index: number }) {
  planConfig.taxDeferredInvestments.splice(payload.index, 1)
}

function handleAddBrokerageInvestment() {
  planConfig.brokerageInvestments.push(defaultBrokerageInvestmentFactory())
}

function handleDeleteBrokerageInvestment(payload: { index: number }) {
  planConfig.brokerageInvestments.splice(payload.index, 1)
}

function handleAddDebt() {
  planConfig.debts.push(defaultDebtFactory())
}

function handleDeleteDebt(payload: { index: number }) {
  planConfig.debts.splice(payload.index, 1)
}

function handleAddExpense() {
  planConfig.expenses.push(simpleExpenseFactory())
}


function handleDeleteExpense(payload: { index: number }) {
  planConfig.expenses.splice(payload.index, 1)
}
const {$db} = useNuxtApp()

const planConfig = reactive(defaultPlanFactory())
let planManager: PlanManager = new PlanManager(planConfig)
const planStates = ref<PlanState[]>(planManager.simulate())

watch(planConfig, (previousState, newState) => {
  planManager = new PlanManager(newState)
  planStates.value = planManager.simulate()
})

const showAdvancedOptions = ref<boolean>(false)


</script>